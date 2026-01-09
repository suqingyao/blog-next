import { createContext } from 'react';

export interface MobileTabGroupContextValue {
  value: string;
  setValue: (value: string) => void;
  componentId: string;
}
export const MobileTabGroupContext = createContext<MobileTabGroupContextValue>(null!);
