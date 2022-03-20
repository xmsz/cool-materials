import { PropsWithChildren } from 'react';
import { Shell, ConfigProvider } from '@alifd/next';
import { DialogProps } from '@alifd/next/types/dialog';
import { PopupProps, OverlayProps } from '@alifd/next/types/overlay';

export const defaultPropsConfig: { Dialog: DialogProps; Popup?: PopupProps; Overlay: OverlayProps } = {
  Dialog: {
    animation: { in: 'zoomIn', out: 'zoomOut' },
    v2: true,
    footerActions: ['cancel', 'ok'],
  },
  Overlay: {
    v2: true,
  },
};

export default ({ children }: PropsWithChildren<{}>) => {
  return (
    <ConfigProvider
      // @ts-ignore type
      defaultPropsConfig={defaultPropsConfig}
    >
      <Shell className="min-h-screen">
        <Shell.Content style={{ padding: 0 }}>{children}</Shell.Content>
      </Shell>
    </ConfigProvider>
  );
};
