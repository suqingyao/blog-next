import { atom } from 'jotai';

export const modalRectAtom = atom<{
  left: number;
  top: number;
  width: number;
  height: number;
  scrollY: number;
} | null>(null);
