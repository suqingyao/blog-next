import { createContext, use } from 'react';

const RootPortalContext = createContext<{
  to?: HTMLElement | undefined;
}>({
  to: undefined,
});

export function useRootPortal() {
  const ctx = use(RootPortalContext);

  return ctx.to || document.body;
}

export const RootPortalProvider = RootPortalContext;
