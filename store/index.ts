import { atom } from 'jotai';

type HeaderAtomProps = {
  pageTitle: string;
  pageTitleElement: HTMLHeadElement | null;
};

export const headerAtom = atom<HeaderAtomProps>({
  pageTitle: '',
  pageTitleElement: null
});
