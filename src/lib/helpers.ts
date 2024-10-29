export const getSiteRelativeUrl = (pathname: string, address: string) => {
  if (address.match(/^https?:\/\//)) {
    return address;
  }
  if (!address.startsWith('/')) {
    address = `/${address}`;
  }
  const reg = /\/(site|posts)\/([^/]*)/;
  if (address.match(reg)) {
    return address;
  } else {
    const match = pathname.match(reg);
    if (match?.[2]) {
      return `/site/${match[2]}${address === '/' ? '' : address}`;
    } else {
      return address;
    }
  }
};
