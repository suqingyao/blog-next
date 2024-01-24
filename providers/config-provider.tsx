import { createContext, useState } from 'react';
import type { FC, PropsWithChildren } from 'react';

export interface ConfigContext {
  soundEnabled?: boolean;
  setSoundEnabled?: (enabled: boolean) => void;
}

export const ConfigContext = createContext({} as ConfigContext);

export const ConfigProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
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
