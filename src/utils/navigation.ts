import { router } from 'expo-router';

// router.back() throws "GO_BACK was not handled by any navigator" whenever
// the current screen has no prior entry in its own history — reached via a
// deep link, or after a JS reload resets navigation state. Every back/close
// button should use this instead of calling router.back() directly.
export function goBack() {
  if (router.canGoBack()) {
    router.back();
  } else {
    router.replace('/');
  }
}
