import InternalAnchor from './anchor';
import AnchorLink from './anchor-link';

type AnchorType = typeof InternalAnchor & {
  Link: typeof AnchorLink;
};

const Anchor = InternalAnchor as AnchorType;

Anchor.Link = AnchorLink;

export default Anchor;
