import { useAtom } from 'jotai';

import { modalRectAtom } from '@/store/atoms';

export function useModalRectAtom() {
  const [modalRect, setModalRect] = useAtom(modalRectAtom);

  return {
    modalRectAtom: modalRect,
    setModalRectAtom: setModalRect,
  };
}
