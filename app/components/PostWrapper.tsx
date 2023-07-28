import React from 'react';

export default function PostWrapper({
  children
}: {
  children: React.ReactNode;
}) {
  return <div className="prose">{children}</div>;
}
