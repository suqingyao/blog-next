import type * as DialogPrimitive from '@radix-ui/react-dialog';
import type { HTMLMotionProps } from 'motion/react';
import type { FC } from 'react';

export type DialogContentProps = React.ComponentProps<typeof DialogPrimitive.Content>
  & HTMLMotionProps<'div'> & {
    /**
     * Whether the dialog can be dismissed by clicking outside (on the overlay).
     * Defaults to `true`.
     */
    dismissOnOutsideClick?: boolean;
  };

export interface ModalComponentProps {
  modalId: string;
  dismiss: () => void;
}

export type ModalComponent<P = unknown> = FC<ModalComponentProps & P> & {
  contentProps?: Partial<DialogContentProps>;
  contentClassName?: string;
};

export type ModalContentConfig = Partial<DialogContentProps>;

export type ModalPresentConfig = ModalContentConfig & {
  /**
   * Control whether this modal can be dismissed by clicking outside.
   * Defaults to `true` when omitted.
   */
  dismissOnOutsideClick?: boolean;
};

export interface ModalItem {
  id: string;
  component: ModalComponent<any>;
  props?: unknown;
  modalContent?: ModalContentConfig;
  /**
   * When `false`, prevent dismissing this modal via outside clicks.
   * `undefined` means "use default" (treated as `true`).
   */
  dismissOnOutsideClick?: boolean;
}
