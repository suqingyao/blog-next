'use client';

import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';

export default function TOC({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const portalRoot = document.querySelector('#portal-portal');
    if (!portalRoot) {
      const newPortalRoot = document.createElement('div');
      newPortalRoot.id = 'portal-portal';
      document.appendChild(newPortalRoot);
    }

    const portal = document.createElement('div');
    portal.className = 'toc-comp';
    portalRoot?.appendChild(portal);

    return () => {
      portalRoot?.removeChild(portal);
      if (portalRoot?.childNodes.length === 0) {
        document.body.removeChild(portalRoot);
      }
    };
  }, []);

  return ReactDOM.createPortal(children, document.querySelector('body')!);
}
