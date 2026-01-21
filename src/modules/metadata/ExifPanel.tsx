import type { FC } from 'react';

import type { PhotoManifestItem, PickedExif } from '@/types/photo';
import { isNil } from 'es-toolkit/compat';
import { useAtomValue } from 'jotai';
import { m } from 'motion/react';
import { Fragment, useCallback, useMemo } from 'react';

import { MotionButtonBase } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-areas';
import { useMobile } from '@/hooks/use-mobile';

import { convertExifGPSToDecimal } from '@/lib/map-utils';
import { Spring } from '@/lib/spring';
import { isExiftoolLoadedAtom } from '@/store/atoms/app';
import { formatExifData, Row } from './formatExifData';

import { HistogramChart } from './HistogramChart';
import { MiniMap } from './MiniMap';
import { RawExifViewer } from './RawExifViewer';
import '@/modules/viewer/PhotoViewer.css';

export const ExifPanelContent: FC<ExifPanelContentProps> = ({
  currentPhoto,
  exifData,
  onTagClick,
  rootClassName = 'flex-1 min-h-0 overflow-auto lg:overflow-hidden',
  viewportClassName = 'px-4 pb-4 **:select-text',
}) => {
  const isMobile = useMobile();
  const formattedExifData = useMemo(() => formatExifData(exifData), [exifData]);
  const gpsData = useMemo(() => convertExifGPSToDecimal(exifData), [exifData]);
  const decimalLatitude = gpsData?.latitude ?? null;
  const decimalLongitude = gpsData?.longitude ?? null;
  const megaPixels = useMemo(() => {
    if (!currentPhoto.height || !currentPhoto.width) {
      return null;
    }
    return (((currentPhoto.height * currentPhoto.width) / 1_000_000) | 0).toString();
  }, [currentPhoto.height, currentPhoto.width]);

  const handleTagClick = useCallback(
    (tag: string) => {
      if (onTagClick) {
        onTagClick(tag);
        return;
      }
      window.open(`/?tags=${tag}`, '_blank', 'noopener,noreferrer');
    },
    [onTagClick],
  );

  return (
    <ScrollArea mask rootClassName={rootClassName} viewportClassName={viewportClassName}>
      <div className={`space-y-${isMobile ? '3' : '4'}`}>
        {/* 基本信息和标签 - 合并到一个 section */}
        <div>
          <h4 className="mb-2 text-sm font-medium text-white/80">基本信息</h4>
          <div className="space-y-1 text-sm">
            <Row label="文件名" value={currentPhoto.title} ellipsis={true} />
            <Row label="格式" value={currentPhoto.format} />
            <Row label="尺寸" value={`${currentPhoto.width} × ${currentPhoto.height}`} />
            <Row label="文件大小" value={`${(currentPhoto.size / 1024 / 1024).toFixed(1)}MB`} />
            {megaPixels && <Row label="像素" value={`${megaPixels} MP`} />}
            {formattedExifData?.colorSpace && (
              <Row label="色彩空间" value={formattedExifData.colorSpace} />
            )}
            {formattedExifData?.rating && formattedExifData.rating > 0
              ? (
                  <Row label="评分" value={'★'.repeat(formattedExifData.rating)} />
                )
              : null}

            {formattedExifData?.dateTime && <Row label="拍摄时间" value={formattedExifData.dateTime} />}

            {formattedExifData?.zone && <Row label="时区" value={formattedExifData.zone} />}
            {formattedExifData?.artist && <Row label="艺术家" value={formattedExifData.artist} />}
            {formattedExifData?.copyright && <Row label="版权" value={formattedExifData.copyright} />}

            {formattedExifData?.software && <Row label="软件" value={formattedExifData.software} />}
          </div>

          {formattedExifData
            && (formattedExifData.shutterSpeed
              || formattedExifData.iso
              || formattedExifData.aperture
              || formattedExifData.exposureBias
              || formattedExifData.focalLength35mm) && (
            <div>
              <h4 className="my-2 text-sm font-medium text-white/80">拍摄参数</h4>
              <div className="grid grid-cols-2 gap-2">
                {formattedExifData.focalLength35mm && (
                  <div className="border-accent/20 bg-accent/10 flex h-6 items-center gap-2 rounded-md border px-2">
                    <i className="i-streamline-image-accessories-lenses-photos-camera-shutter-picture-photography-pictures-photo-lens text-sm text-white/70" />
                    <span className="text-xs">
                      {formattedExifData.focalLength35mm}
                      mm
                    </span>
                  </div>
                )}

                {formattedExifData.aperture && (
                  <div className="border-accent/20 bg-accent/10 flex h-6 items-center gap-2 rounded-md border px-2">
                    <i className="i-lucide-aperture text-sm text-white/70" />
                    <span className="text-xs">{formattedExifData.aperture}</span>
                  </div>
                )}

                {formattedExifData.shutterSpeed && (
                  <div className="border-accent/20 bg-accent/10 flex h-6 items-center gap-2 rounded-md border px-2">
                    <i className="i-material-symbols-shutter-speed text-sm text-white/70" />
                    <span className="text-xs">{formattedExifData.shutterSpeed}</span>
                  </div>
                )}

                {formattedExifData.iso && (
                  <div className="border-accent/20 bg-accent/10 flex h-6 items-center gap-2 rounded-md border px-2">
                    <i className="i-carbon-iso-outline text-sm text-white/70" />
                    <span className="text-xs">
                      ISO
                      {formattedExifData.iso}
                    </span>
                  </div>
                )}

                {formattedExifData.exposureBias && (
                  <div className="border-accent/20 bg-accent/10 flex h-6 items-center gap-2 rounded-md border px-2">
                    <i className="i-material-symbols-exposure text-sm text-white/70" />
                    <span className="text-xs">{formattedExifData.exposureBias}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 标签信息 - 移到基本信息 section 内 */}
          {currentPhoto.tags && currentPhoto.tags.length > 0 && (
            <div className="mt-3 mb-3">
              <h4 className="mb-2 text-sm font-medium text-white/80">标签</h4>
              <div className="-ml-1 flex flex-wrap gap-1.5">
                {currentPhoto.tags.map(tag => (
                  <MotionButtonBase
                    type="button"
                    onClick={() => handleTagClick(tag)}
                    key={tag}
                    className="glassmorphic-btn border-accent/20 bg-accent/10 inline-flex cursor-pointer items-center rounded-full border px-2 py-1 text-xs text-white/90 backdrop-blur-sm"
                  >
                    {tag}
                  </MotionButtonBase>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 影调分析和直方图 */}
        {currentPhoto.toneAnalysis && (
          <div>
            <h4 className="mb-2 text-sm font-medium text-white/80">影调分析</h4>
            <div>
              {/* 影调信息 */}
              <Row
                label="影调类型"
                value={(() => {
                  const toneTypeMap = {
                    'low-key': '低调',
                    'high-key': '高调',
                    'normal': '正常',
                    'high-contrast': '高对比度',
                  };
                  return toneTypeMap[currentPhoto.toneAnalysis!.toneType] || currentPhoto.toneAnalysis!.toneType;
                })()}
              />
              <div className="mt-1 mb-3 grid grid-cols-2 gap-x-2 gap-y-1 text-sm">
                <Row label="亮度" value={`${currentPhoto.toneAnalysis.brightness}%`} />
                <Row label="对比度" value={`${currentPhoto.toneAnalysis.contrast}%`} />
                <Row
                  label="阴影占比"
                  value={`${Math.round(currentPhoto.toneAnalysis.shadowRatio * 100)}%`}
                />
                <Row
                  label="高光占比"
                  value={`${Math.round(currentPhoto.toneAnalysis.highlightRatio * 100)}%`}
                />
              </div>

              {/* 直方图 */}
              <div className="mb-3">
                <div className="mb-2 text-xs font-medium text-white/70">直方图</div>
                <HistogramChart thumbnailUrl={currentPhoto.thumbnailUrl} />
              </div>
            </div>
          </div>
        )}

        {formattedExifData && (
          <Fragment>
            {(formattedExifData.camera || formattedExifData.lens) && (
              <div>
                <h4 className="my-2 text-sm font-medium text-white/80">设备信息</h4>
                <div className="space-y-1 text-sm">
                  {formattedExifData.camera && <Row label="相机" value={formattedExifData.camera} />}
                  {formattedExifData.lens && <Row label="镜头" value={formattedExifData.lens} />}
                  {formattedExifData.lensMake && !formattedExifData.lens?.includes(formattedExifData.lensMake) && (
                    <Row label="镜头制造商" value={formattedExifData.lensMake} />
                  )}

                  {formattedExifData.focalLength && (
                    <Row label="焦距" value={`${formattedExifData.focalLength}mm`} />
                  )}
                  {formattedExifData.focalLength35mm && (
                    <Row label="35mm 等效" value={`${formattedExifData.focalLength35mm}mm`} />
                  )}
                  {formattedExifData.maxAperture && (
                    <Row label="最大光圈" value={`f/${formattedExifData.maxAperture}`} />
                  )}
                </div>
              </div>
            )}

            {/* 新增：拍摄模式信息 */}
            {(formattedExifData.exposureMode
              || formattedExifData.exposureProgram
              || formattedExifData.meteringMode
              || formattedExifData.whiteBalance
              || formattedExifData.lightSource
              || formattedExifData.flash) && (
              <div>
                <h4 className="my-2 text-sm font-medium text-white/80">拍摄模式</h4>
                <div className="space-y-1 text-sm">
                  {!isNil(formattedExifData.exposureProgram) && (
                    <Row label="曝光程序" value={formattedExifData.exposureProgram} />
                  )}
                  {!isNil(formattedExifData.exposureMode) && (
                    <Row label="曝光模式" value={formattedExifData.exposureMode} />
                  )}
                  {!isNil(formattedExifData.meteringMode) && (
                    <Row label="测光模式" value={formattedExifData.meteringMode} />
                  )}
                  {!isNil(formattedExifData.whiteBalance) && (
                    <Row label="白平衡" value={formattedExifData.whiteBalance} />
                  )}
                  {!isNil(formattedExifData.whiteBalanceBias) && (
                    <Row label="白平衡偏移" value={`${formattedExifData.whiteBalanceBias} Mired`} />
                  )}
                  {!isNil(formattedExifData.wbShiftAB) && (
                    <Row label="白平衡偏移 (琥珀色 - 蓝色)" value={formattedExifData.wbShiftAB} />
                  )}
                  {!isNil(formattedExifData.wbShiftGM) && (
                    <Row label="白平衡偏移 (绿色 - 品红色)" value={formattedExifData.wbShiftGM} />
                  )}
                  {/* {!isNil(formattedExifData.whiteBalanceFineTune) && (
                    <Row
                      label={t('exif.white.balance.fine.tune')}
                      value={formattedExifData.whiteBalanceFineTune}
                    />
                  )} */}

                  {!isNil(formattedExifData.flash) && (
                    <Row label="闪光灯" value={formattedExifData.flash} />
                  )}
                  {!isNil(formattedExifData.lightSource) && (
                    <Row label="光源" value={formattedExifData.lightSource} />
                  )}
                  {!isNil(formattedExifData.sceneCaptureType) && (
                    <Row label="场景捕获类型" value={formattedExifData.sceneCaptureType} />
                  )}
                  {!isNil(formattedExifData.flashMeteringMode) && (
                    <Row label="闪光灯测光模式" value={formattedExifData.flashMeteringMode} />
                  )}
                </div>
              </div>
            )}

            {formattedExifData.fujiRecipe && (
              <div>
                <h4 className="my-2 text-sm font-medium text-white/80">胶片模拟配方</h4>
                <div className="space-y-1 text-sm">
                  {formattedExifData.fujiRecipe.FilmMode && (
                    <Row label="胶片模式" value={formattedExifData.fujiRecipe.FilmMode} />
                  )}
                  {!isNil(formattedExifData.fujiRecipe.DynamicRange) && (
                    <Row label="动态范围" value={formattedExifData.fujiRecipe.DynamicRange} />
                  )}
                  {!isNil(formattedExifData.fujiRecipe.WhiteBalance) && (
                    <Row label="白平衡" value={formattedExifData.fujiRecipe.WhiteBalance} />
                  )}
                  {!isNil(formattedExifData.fujiRecipe.HighlightTone) && (
                    <Row label="高光色调" value={formattedExifData.fujiRecipe.HighlightTone} />
                  )}
                  {!isNil(formattedExifData.fujiRecipe.ShadowTone) && (
                    <Row label="阴影色调" value={formattedExifData.fujiRecipe.ShadowTone} />
                  )}
                  {!isNil(formattedExifData.fujiRecipe.Saturation) && (
                    <Row label="饱和度" value={formattedExifData.fujiRecipe.Saturation} />
                  )}
                  {!isNil(formattedExifData.fujiRecipe.Sharpness) && (
                    <Row label="锐度" value={formattedExifData.fujiRecipe.Sharpness} />
                  )}
                  {!isNil(formattedExifData.fujiRecipe.NoiseReduction) && (
                    <Row label="降噪" value={formattedExifData.fujiRecipe.NoiseReduction} />
                  )}
                  {!isNil(formattedExifData.fujiRecipe.Clarity) && (
                    <Row label="清晰度" value={formattedExifData.fujiRecipe.Clarity} />
                  )}
                  {!isNil(formattedExifData.fujiRecipe.ColorChromeEffect) && (
                    <Row label="色彩效果" value={formattedExifData.fujiRecipe.ColorChromeEffect} />
                  )}
                  {!isNil(formattedExifData.fujiRecipe.ColorChromeFxBlue) && (
                    <Row label="彩色 Fx 蓝色" value={formattedExifData.fujiRecipe.ColorChromeFxBlue} />
                  )}
                  {!isNil(formattedExifData.fujiRecipe.WhiteBalanceFineTune) && (
                    <Row
                      label="白平衡微调"
                      value={formattedExifData.fujiRecipe.WhiteBalanceFineTune}
                    />
                  )}
                  {(!isNil(formattedExifData.fujiRecipe.GrainEffectRoughness)
                    || !isNil(formattedExifData.fujiRecipe.GrainEffectSize)) && (
                    <Fragment>
                      {formattedExifData.fujiRecipe.GrainEffectRoughness && (
                        <Row
                          label="颗粒效果强度"
                          value={formattedExifData.fujiRecipe.GrainEffectRoughness}
                        />
                      )}
                      {!isNil(formattedExifData.fujiRecipe.GrainEffectSize) && (
                        <Row label="颗粒效果大小" value={formattedExifData.fujiRecipe.GrainEffectSize} />
                      )}
                    </Fragment>
                  )}
                </div>
              </div>
            )}
            {formattedExifData.gps && (
              <div>
                <h4 className="my-2 text-sm font-medium text-white/80">位置信息</h4>
                <div className="space-y-1 text-sm">
                  <Row label="纬度" value={formattedExifData.gps.latitude} />
                  <Row label="经度" value={formattedExifData.gps.longitude} />
                  {formattedExifData.gps.altitude && (
                    <Row label="海拔" value={`${formattedExifData.gps.altitude}m`} />
                  )}

                  {/* 反向地理编码位置信息 */}
                  {currentPhoto.location && (
                    <div className="mt-3 space-y-1">
                      {(currentPhoto.location.city || currentPhoto.location.country) && (
                        <Row
                          label="城市"
                          value={[currentPhoto.location.city, currentPhoto.location.country].filter(Boolean).join(', ')}
                        />
                      )}
                      {currentPhoto.location.locationName && (
                        <Row label="地址" value={currentPhoto.location.locationName} ellipsis={true} />
                      )}
                    </div>
                  )}

                  {/* Maplibre MiniMap */}
                  {decimalLatitude !== null && decimalLongitude !== null && (
                    <div className="mt-3">
                      <MiniMap latitude={decimalLatitude} longitude={decimalLongitude} photoId={currentPhoto.id} />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 新增：技术参数 */}
            {(formattedExifData.brightnessValue
              || formattedExifData.shutterSpeedValue
              || formattedExifData.apertureValue
              || formattedExifData.sensingMethod
              || formattedExifData.focalPlaneXResolution
              || formattedExifData.focalPlaneYResolution) && (
              <div>
                <h4 className="my-2 text-sm font-medium text-white/80">技术参数</h4>
                <div className="space-y-1 text-sm">
                  {formattedExifData.brightnessValue && (
                    <Row label="亮度" value={formattedExifData.brightnessValue} />
                  )}
                  {formattedExifData.shutterSpeedValue && (
                    <Row label="快门速度" value={formattedExifData.shutterSpeedValue} />
                  )}
                  {formattedExifData.apertureValue && (
                    <Row label="光圈值" value={formattedExifData.apertureValue} />
                  )}
                  {formattedExifData.sensingMethod && (
                    <Row label="感光方式" value={formattedExifData.sensingMethod} />
                  )}

                  {(formattedExifData.focalPlaneXResolution || formattedExifData.focalPlaneYResolution) && (
                    <Row
                      label="焦平面分辨率"
                      value={`${formattedExifData.focalPlaneXResolution || '不可用'} × ${formattedExifData.focalPlaneYResolution || '不可用'}`}
                    />
                  )}
                </div>
              </div>
            )}
          </Fragment>
        )}
      </div>
    </ScrollArea>
  );
};

interface ExifPanelBaseProps {
  currentPhoto: PhotoManifestItem;
  exifData: PickedExif | null;
}

interface ExifPanelProps extends ExifPanelBaseProps {
  onClose?: () => void;
  visible?: boolean;
}

export const ExifPanel: FC<ExifPanelProps> = ({ currentPhoto, exifData, onClose, visible = true }) => {
  // const { t } = useTranslation();
  const isMobile = useMobile();
  const isExiftoolLoaded = useAtomValue(isExiftoolLoadedAtom);

  return (
    <m.div
      className={`${
        isMobile
          ? 'exif-panel-mobile fixed right-0 bottom-0 left-0 z-10 max-h-[60vh] w-full rounded-t-2xl backdrop-blur-2xl'
          : 'relative w-80 shrink-0 backdrop-blur-2xl'
      } border-accent/20 flex flex-col text-white`}
      initial={{
        opacity: 0,
        ...(isMobile ? { y: 100 } : { x: 100 }),
      }}
      animate={{
        opacity: visible ? 1 : 0,
        ...(isMobile ? { y: visible ? 0 : 100 } : { x: visible ? 0 : 100 }),
      }}
      exit={{
        opacity: 0,
        ...(isMobile ? { y: 100 } : { x: 100 }),
      }}
      transition={Spring.presets.smooth}
      style={{
        pointerEvents: visible ? 'auto' : 'none',
        backgroundImage:
          'linear-gradient(to bottom right, rgba(var(--color-materialMedium)), rgba(var(--color-materialThick)), transparent)',
        boxShadow:
          '0 8px 32px color-mix(in srgb, var(--color-accent) 8%, transparent), 0 4px 16px color-mix(in srgb, var(--color-accent) 6%, transparent), 0 2px 8px rgba(0, 0, 0, 0.1)',
      }}
    >
      {/* Inner glow layer */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom right, color-mix(in srgb, var(--color-accent) 5%, transparent), transparent, color-mix(in srgb, var(--color-accent) 5%, transparent))',
        }}
      />
      <div className="relative z-10 mb-4 flex shrink-0 items-center justify-between p-4 pb-0">
        <h3 className={`${isMobile ? 'text-base' : 'text-lg'} font-semibold`}>照片信息</h3>
        {!isMobile && isExiftoolLoaded && <RawExifViewer currentPhoto={currentPhoto} />}
        {isMobile && onClose && (
          <button
            type="button"
            className="glassmorphic-btn border-accent/20 flex size-6 items-center justify-center rounded-full border text-white/70 duration-200 hover:text-white"
            onClick={onClose}
          >
            <i className="i-mingcute-close-line text-sm" />
          </button>
        )}
      </div>

      <ExifPanelContent currentPhoto={currentPhoto} exifData={exifData} />
    </m.div>
  );
};

interface ExifPanelContentProps extends ExifPanelBaseProps {
  onTagClick?: (tag: string) => void;
  rootClassName?: string;
  viewportClassName?: string;
}
