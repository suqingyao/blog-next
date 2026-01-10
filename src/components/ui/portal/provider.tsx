import { createContext, use } from 'react';

const RootPortalContext = createContext<{
  to?: HTMLElement | undefined;
}>({
  to: undefined,
});

export function useRootPortal() {
  const ctx = use(RootPortalContext);

  // SSR safe: only return document.body on client side
  return ctx.to || (typeof document !== 'undefined' ? document.body : null);
}

export const RootPortalProvider = RootPortalContext;
