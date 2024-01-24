import { useContext } from 'react';
import useSoundBase from 'use-sound';
import { HookOptions } from 'use-sound/dist/types';
import { ConfigContext } from '../providers/config-provider';

export const useSound = <T = any>(
  url: string | string[],
  delegated?: HookOptions<T>
) => {
  const { soundEnabled } = useContext(ConfigContext);

  return useSoundBase(url, { soundEnabled, ...delegated });
};
