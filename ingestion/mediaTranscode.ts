import { execFile } from 'node:child_process';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

export interface TranscodedMedia {
  videoPath: string;
  posterPath: string;
}

// Converts a hotlinked GIF into a muted looping MP4 (cheap to decode on a
// scrolling list, unlike GIF) plus a static WebP poster frame for the list/
// rail views. Requires ffmpeg on PATH — this is a Phase 0 stub: it produces
// local files but does not yet upload them anywhere. Wiring this into
// Cloudflare R2 is deferred until the account/credentials exist (see the
// architecture proposal's open decisions).
export async function transcodeGifToVideoAndPoster(gifUrl: string): Promise<TranscodedMedia> {
  const workDir = await mkdtemp(join(tmpdir(), 'exercisexpert-media-'));
  const gifPath = join(workDir, 'source.gif');
  const videoPath = join(workDir, 'output.mp4');
  const posterPath = join(workDir, 'poster.webp');

  const response = await fetch(gifUrl);
  if (!response.ok) {
    throw new Error(`Failed to download source media: ${response.status} ${gifUrl}`);
  }
  const buffer = Buffer.from(await response.arrayBuffer());
  await writeFile(gifPath, buffer);

  await execFileAsync('ffmpeg', [
    '-i', gifPath,
    '-movflags', 'faststart',
    '-pix_fmt', 'yuv420p',
    '-vf', 'scale=trunc(iw/2)*2:trunc(ih/2)*2',
    '-an',
    videoPath,
  ]);

  await execFileAsync('ffmpeg', ['-i', gifPath, '-frames:v', '1', posterPath]);

  return { videoPath, posterPath };
}

export async function cleanupTranscodedMedia(media: TranscodedMedia): Promise<void> {
  await rm(join(media.videoPath, '..'), { recursive: true, force: true });
}

// Placeholder for the real destination — swap this out once Cloudflare R2
// credentials exist. Signature stays the same so callers don't change.
export async function uploadToCdn(_localPath: string, _destinationKey: string): Promise<string> {
  throw new Error(
    'uploadToCdn is not wired up yet — configure Cloudflare R2 credentials and implement this before running ingestion against production.'
  );
}
