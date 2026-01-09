import type { FC } from 'react';

import type { PhotoManifest, PickedExif } from '@/types/photo';
import { ExifPanel } from '@/modules/metadata/ExifPanel';
// import { injectConfig } from '~/config';

// import { InspectorPanel } from './InspectorPanel';

export interface PhotoInspectorProps {
  currentPhoto: PhotoManifest;
  exifData: PickedExif | null;
  visible?: boolean;
  onClose?: () => void;
}

// const CloudInspector: FC<PhotoInspectorProps> = props => <InspectorPanel {...props} />;

const LegacyInspector: FC<PhotoInspectorProps> = ({ currentPhoto, exifData, ...rest }) => (
  <ExifPanel currentPhoto={currentPhoto} exifData={exifData} {...rest} />
);

export const PhotoInspector: FC<PhotoInspectorProps> = LegacyInspector;
// injectConfig.useCloud ? CloudInspector : LegacyInspector;
