import { PropsWithChildren, useMemo } from 'react';
import { Shell, ConfigProvider, Nav } from '@alifd/next';
import { DialogProps } from '@alifd/next/types/dialog';
import { PopupProps, OverlayProps } from '@alifd/next/types/overlay';
import { TooltipProps } from '@alifd/next/types/balloon';
import { useLocalStorageState } from 'ahooks';
import useDevice from '@/hooks/useDevice';
import useNavMenu from '@/hooks/useNavMenu';
import { useHistory } from 'ice';

export const defaultPropsConfig: {
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
  Popup: {
    v2: true,
  },
  Overlay: {
    v2: true,
  },
  Tooltip: {
    v2: true,
  },
};

export default ({ children }: PropsWithChildren<{}>) => {
  const [navCollapse, setNavCollapse] = useLocalStorageState('BasicLayout#NavCollapse', {
    defaultValue: true,
  });
  const device = useDevice();
  const history = useHistory();
  const menuConfig = useMemo(() => {
    return [
      {
        icon: 'list-alt',
        label: '记录',
        value: `/record`,
      },
    ];
  }, []);
  const { selectedKeys } = useNavMenu({ menuConfig });

  return (
    <ConfigProvider
      // @ts-ignore type
      defaultPropsConfig={defaultPropsConfig}
    >
      <Shell className="min-h-screen" device={device}>
        <Shell.Navigation
          {...(device === 'phone' ? {} : { trigger: null, collapse: navCollapse })}
          className={'overflow-auto'}
        >
          <Nav
            embeddable
            className={` flex-grow sm:mt-2 next-rounded ${device !== 'phone' && navCollapse ? 'mx-auto' : 'mx-2'}`}
            selectedKeys={selectedKeys}
            type="line"
            activeDirection={null}
            onItemClick={(key) => {
              history.push({ pathname: key });
            }}
            iconOnlyWidth={52}
          >
            {menuConfig.map((item) => (
              <Nav.Item key={item.value} icon={item.icon}>
                {item.label}
              </Nav.Item>
            ))}
          </Nav>

          <div className="flex items-center justify-end pb-2">
            <div
              className="border border-gray-200 py-2 px-1 rounded mr-4 text-gray-600 cursor-pointer"
              onClick={() => {
                setNavCollapse((prev) => !prev);
              }}
            >
              <i className="i-ic-outline-arrow-back-ios block w-3 h-3" />
            </div>
          </div>
        </Shell.Navigation>

        <Shell.Content style={{ padding: 0 }}>{children}</Shell.Content>
      </Shell>
    </ConfigProvider>
  );
};
