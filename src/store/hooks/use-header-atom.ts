import { useAtom } from 'jotai';

import { headerAtom } from '@/store/atoms';

export const useHeaderAtom = () => {
  const [header, setHeader] = useAtom(headerAtom);

  return {
    headerAtom: header,
    setHeaderAtom: setHeader
  };
};
