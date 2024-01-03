export const transitionViewIfSupported = (callback: () => void) => {
  const isAppearanceTransition =
    // @ts-expect-error experimental API
    document.startViewTransition &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!isAppearanceTransition) {
    callback();
    return;
  }

  // @ts-expect-error Transition API
  return document.startViewTransition(callback);
};
