import { useAtom } from 'jotai';

import { headerAtom } from '@/atoms';

export const useHeaderAtom = () => {
  const [header, setHeader] = useAtom(headerAtom);

  return {
    headerAtom: header,
    setHeaderAtom: setHeader
  };
};
