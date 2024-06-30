'use client';

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState
} from 'react';
import { isFunction, isUndefined } from 'lodash-es';
import { AffixProps, AffixRef, AffixState } from './type';
import ResizeObserver from '@/components/resize-observer';

import { cn } from '@/lib/utils';
import { on, off, getTargetRect } from '../_utils/dom';
import { throttleByRaf } from '../_utils/throttleByRaf';

const Affix = forwardRef<AffixRef, AffixProps>((props, ref) => {
  const {
    offsetTop = 0,
    offsetBottom,
    style,
    className,
    affixStyle,
    affixClassName,
    target = () => window,
    targetContainer,
    onChange,
    children,
    ...rest
  } = props;

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const targetRef = useRef<HTMLElement | null | Window>(null);

  const classNames = cn(className, 'affix');

  const [affixState, setAffixState] = useState<AffixState>({
    status: 'MEASURE_DONE',
    isFixed: false,
    affixStyle: {},
    placeholderStyle: {}
  });

  const lastIsFixed = useRef(affixState.isFixed);
  const updatePosition = useCallback(
    throttleByRaf(() => {
      setAffixState({
        status: 'MEASURE_START',
        isFixed: false,
        affixStyle: {},
        placeholderStyle: {}
      });
    }),
    []
  );

  useEffect(() => {
    if (
      affixState.status !== 'MEASURE_START' ||
      !wrapperRef.current ||
      !targetRef.current
    )
      return;

    const offsetType = isUndefined(offsetBottom) ? 'top' : 'bottom';
    const wrapperRect = getTargetRect(wrapperRef.current);
    const targetRect = getTargetRect(targetRef.current);

    let isFixed = false;
    let affixStyle = {};
    if (offsetType === 'top') {
      isFixed = wrapperRect.top - targetRect.top < (offsetTop || 0);
      affixStyle = isFixed
        ? {
            position: 'fixed',
            top: targetRect.top + (offsetTop || 0)
          }
        : {};
    } else {
      isFixed = targetRect.bottom - wrapperRect.bottom < (offsetBottom || 0);
      affixStyle = isFixed
        ? {
            position: 'fixed',
            bottom: window.innerHeight - targetRect.bottom + (offsetBottom || 0)
          }
        : {};
    }

    const sizeStyle = isFixed
      ? {
          width: wrapperRef.current.offsetWidth,
          height: wrapperRef.current.offsetHeight
        }
      : {};

    setAffixState({
      status: 'MEASURE_DONE',
      isFixed,
      affixStyle: sizeStyle,
      placeholderStyle: { ...affixStyle, ...sizeStyle }
    });

    if (isFixed !== lastIsFixed.current) {
      lastIsFixed.current = isFixed;
      onChange?.(isFixed);
    }
  }, [affixState, offsetBottom, offsetTop, onChange]);

  useEffect(() => {
    updatePosition();
  }, [target, targetContainer, offsetBottom, offsetTop, updatePosition]);

  useEffect(() => {
    targetRef.current = target && isFunction(target) ? target() : null;
    if (targetRef.current) {
      on(targetRef.current, 'scroll', updatePosition);
      on(targetRef.current, 'resize', updatePosition);
      return () => {
        off(targetRef.current, 'scroll', updatePosition);
        off(targetRef.current, 'resize', updatePosition);
      };
    }
  }, [target, updatePosition]);

  useImperativeHandle(ref, () => ({
    updatePosition
  }));

  return (
    <ResizeObserver onResize={updatePosition}>
      <div
        ref={wrapperRef}
        className={classNames}
        style={style}
        {...rest}
      >
        {affixState.isFixed && <div style={affixState.placeholderStyle} />}
        <div
          className={cn('affix' && affixState.isFixed, affixClassName)}
          style={{ ...affixState.affixStyle, ...affixStyle }}
        >
          <ResizeObserver onResize={updatePosition}>{children}</ResizeObserver>
        </div>
      </div>
    </ResizeObserver>
  );
});

Affix.displayName = 'Affix';

export default Affix;
