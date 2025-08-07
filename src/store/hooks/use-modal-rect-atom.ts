import { useAtom } from 'jotai';

import { modalRectAtom } from '@/store/atoms';

export const useModalRectAtom = () => {
  const [modalRect, setModalRect] = useAtom(modalRectAtom);

  return {
    modalRectAtom: modalRect,
    setModalRectAtom: setModalRect
  };
};
