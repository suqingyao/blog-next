'use client';
import { ThemeProvider } from 'next-themes';
import { ThemeProviderProps } from 'next-themes/dist/types';
import { createContext, FC, PropsWithChildren, useState } from 'react';

export interface ConfigProviderProps extends ThemeProviderProps {}

export interface ConfigContext {
  soundEnabled?: boolean;
  setSoundEnabled?: (enabled: boolean) => void;
}

export const ConfigContext = createContext({} as ConfigContext);

const ConfigProvider: FC<PropsWithChildren<ConfigProviderProps>> = ({
  children,
  ...rest
}) => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  return (
    <ThemeProvider {...rest}>
      <ConfigContext.Provider value={{ soundEnabled, setSoundEnabled }}>
        {children}
      </ConfigContext.Provider>
    </ThemeProvider>
  );
};

export default ConfigProvider;
