import { atom } from 'jotai';

interface HeaderAtomProps {
  pageTitle: string;
  pageTitleElement: HTMLHeadElement | null;
}

export const headerAtom = atom<HeaderAtomProps>({
  pageTitle: '',
  pageTitleElement: null,
});
