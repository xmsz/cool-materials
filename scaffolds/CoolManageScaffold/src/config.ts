import { TooltipProps } from '@alifd/next/types/balloon';
import { DialogProps } from '@alifd/next/types/dialog';
import { FormProps } from '@alifd/next/types/form';
import { PopupProps, OverlayProps } from '@alifd/next/types/overlay';

export const ConfigProvideConfig: {
  Dialog: DialogProps;
  Popup?: PopupProps;
  Overlay: OverlayProps;
  Tooltip: TooltipProps;
  Form?: FormProps;
} = {
  Dialog: {
    animation: { in: 'zoomIn', out: 'zoomOut' },
    v2: true,
    footerActions: ['cancel', 'ok'],
  },
  Overlay: {
    v2: true,
  },
  Tooltip: {
    v2: true,
  },
  Form: {
    useLabelForErrorMessage: true,
  },
};
