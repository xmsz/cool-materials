import useDevice from '@/hooks/useDevice';
import store from '@/store';
import { Button, Icon, Nav } from '@alifd/next';
import { PropsWithChildren, useEffect, useMemo } from 'react';
import { useHistory, useLocation } from 'ice';
import { GroupFormPopup } from '@/components/GroupForm';
import compShowApi from '@/libs/compShowApi';
import useNavMenu from '@/hooks/useNavMenu';

export default ({ children }: PropsWithChildren<{}>) => {
  const [groupState] = store.useModel('group');
  const device = useDevice();
  const history = useHistory();
  const location = useLocation();

  const menuConfig = useMemo(
    () => groupState.list.map((item) => ({ label: item.name, value: `/record/${item.id}` })),
    [groupState.list],
  );
  const { selectedKeys } = useNavMenu({ menuConfig });

  useEffect(() => {
    if (location.pathname === '/record') {
      history.push(`/record/${groupState.list[0].id}`);
    }
  }, [location]);

  return (
    <div className="sm:flex">
      <aside
        className={`overflow-y-auto flex-shrink-0 border-t-0 border-b-0 border-l-0 border-r border-gray-200 pt-2 pb-4 w-full h-auto flex items-center sm:block sm:h-screen sm:w-48 sm:pt-4 sm:pb-0`}
      >
        <Nav
          selectedKeys={selectedKeys}
          embeddable
          onItemClick={(key) => {
            history.push({ pathname: key });
          }}
          className={`flex mx-2 sm:block sm:h-auto sm:mx-0 ${device === 'phone' ? 'next-rounded' : ''}`}
          activeDirection={device === 'phone' ? 'bottom' : 'right'}
          style={{
            height: 'auto',
          }}
        >
          {menuConfig.map((item) => {
            return (
              <Nav.Item key={item.value}>
                <span className="text-xs mr-3  hidden sm:inline-block">•</span>
                {item.label}
              </Nav.Item>
            );
          })}
        </Nav>
        <div className="px-3 py-2">
          <Button
            type="primary"
            text
            iconSize="xs"
            size="small"
            onClick={() => {
              compShowApi(GroupFormPopup, {
                onSuccess: (res) => {
                  history.push({ pathname: `/record/${res.id}` });
                },
              });
            }}
          >
            <Icon type="add" className="mr-1" />
            <span className="font-normal">创建分组</span>
          </Button>
        </div>
      </aside>
      <div className="flex-grow sm:overflow-y-auto sm:h-screen">{children}</div>
    </div>
  );
};
