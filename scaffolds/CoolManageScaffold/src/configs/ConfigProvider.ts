import { TooltipProps } from '@alifd/next/types/balloon';
import { DialogProps } from '@alifd/next/types/dialog';
import { PopupProps, OverlayProps } from '@alifd/next/types/overlay';

export const ConfigProvideConfig: {
  Dialog: DialogProps;
  Popup?: PopupProps;
  Overlay: OverlayProps;
  Tooltip: TooltipProps;
} = {
  Dialog: {
    animation: { in: 'zoomIn', out: 'zoomOut' },
    v2: true,
    footerActions: ['cancel', 'ok'],
  },
  // Popup: {
  //   v2: true,
  // },
  Overlay: {
    v2: true,
  },
  Tooltip: {
    v2: true,
  },
};
