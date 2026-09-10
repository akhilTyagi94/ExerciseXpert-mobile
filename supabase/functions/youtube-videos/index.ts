// Deno Edge Function. Deploy with `supabase functions deploy youtube-videos`
// and set the RAPIDAPI_KEY secret with `supabase secrets set`.
//
// Replaces the old web app's direct client-side call to
// youtube-search-and-download.p.rapidapi.com (see the original
// src/utils/fetchData.js) — the app now calls this function instead, so the
// RapidAPI key never ships in the client bundle.

const RAPIDAPI_HOST = 'youtube-search-and-download.p.rapidapi.com';

Deno.serve(async (req) => {
  const { query } = await req.json().catch(() => ({ query: null }));
  if (!query) {
    return new Response(JSON.stringify({ error: 'Missing required "query" parameter' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const apiKey = Deno.env.get('RAPIDAPI_KEY');
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'RAPIDAPI_KEY is not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const response = await fetch(
    `https://${RAPIDAPI_HOST}/search?query=${encodeURIComponent(query)}`,
    { headers: { 'X-RapidAPI-Key': apiKey, 'X-RapidAPI-Host': RAPIDAPI_HOST } }
  );

  if (!response.ok) {
    return new Response(JSON.stringify({ error: 'Upstream YouTube search failed' }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const data = await response.json();
  const videos = (data.contents ?? [])
    .slice(0, 3)
    .map((item: any) => ({
      videoId: item.video.videoId,
      title: item.video.title,
      thumbnailUrl: item.video.thumbnails?.[0]?.url,
      channelName: item.video.channelName,
    }));

  return new Response(JSON.stringify({ videos }), {
    headers: { 'Content-Type': 'application/json' },
  });
});
