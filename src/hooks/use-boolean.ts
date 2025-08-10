import { useMemo, useState } from 'react';

interface Actions {
  set: (value: boolean) => void;
  setTrue: () => void;
  setFalse: () => void;
  toggle: () => void;
}

export function useBoolean(defaultValue?: boolean) {
  const [value, setValue] = useState(!!defaultValue);

  const actions: Actions = useMemo(() => {
    return {
      set: v => setValue(v),
      setTrue: () => setValue(true),
      setFalse: () => setValue(false),
      toggle: () => setValue(v => !v),
    };
  }, []);

  return [value, actions] as const;
}
