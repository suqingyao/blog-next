'use client';

import { createContext, useState } from 'react';

export interface ConfigContext {
  soundEnabled?: boolean;
  setSoundEnabled?: (enabled: boolean) => void;
}

export const ConfigContext = createContext({} as ConfigContext);

export const ConfigProvider = ({ children }: { children: React.ReactNode }) => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  return (
    <ConfigContext.Provider
      value={{
        soundEnabled,
        setSoundEnabled
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
};
