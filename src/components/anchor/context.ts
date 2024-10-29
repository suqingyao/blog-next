import type { Anchor } from './anchor';
import { createContext } from 'react';

const AnchorContext = createContext<Anchor | undefined>(undefined);

export default AnchorContext;
