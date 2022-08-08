import { PropsWithChildren, ReactNode, useState } from 'react';
import { history } from 'ice';
import Logo from '@/components/Logo';
import { Menu, Overlay } from '@alifd/next';

const MENU = [
  {
    label: '列表',
    path: '/plan/list',
  },
];

function Basic({
  children,
  aside,
  navActiveDefault,
}: PropsWithChildren<{ aside: ReactNode; navActiveDefault?: string }>) {
  const [navActive, setNavActive] = useState(navActiveDefault || MENU[0].label);
  const accountState = {
    name: '管理员',
    avatar:
      'https://st-gdx.dancf.com/gaodingx/67416979/me/settings/20220720-154236-9d33.png?x-oss-process=image/resize,w_60/interlace,1',
    id: 1,
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <header className="border-b border-gray-200 px-4  flex items-center justify-between">
        <Logo />

        <div className="flex-grow md:ml-11">
          <ul className=" text-sm md:text-base max-w-max flex">
            {MENU.map((item) => (
              <li
                className={`px-2 md:px-5 pt-3.5 cursor-pointer hover:text-indigo-600  ${
                  navActive === item.label ? 'text-indigo-600  font-bold' : ''
                }`}
                key={item.label}
                onClick={() => {
                  setNavActive(item.label);
                  history?.push(item.path);
                }}
              >
                <span>{item.label}</span>
                {navActive === item.label && <i className="block w-full h-[3px] bg-indigo-600 rounded-full mt-3.5" />}
              </li>
            ))}
          </ul>
        </div>
        <Overlay.Popup
          trigger={
            <div className="flex items-center py-2 cursor-pointer scale-85 md:scale-100 origin-right ">
              <i className=" bg-cover w-8 h-8 block rounded-full  mr-2 flex-shrink-0 overflow-hidden">
                <img referrerPolicy="no-referrer" src={accountState.avatar} className="w-full h-full object-cover " />
              </i>

              <div>
                <span className="block text-gray-800">{accountState.name}</span>
                <span className="text-gray-400 block text-xs scale-95 origin-left">ID: {accountState.id}</span>
              </div>
            </div>
          }
        >
          <Menu>
            <Menu.Item>子菜单1</Menu.Item>
            <Menu.Item>子菜单2</Menu.Item>
            <Menu.Divider />
            <Menu.Item>退出登录</Menu.Item>
          </Menu>
        </Overlay.Popup>
      </header>
      <div className="flex flex-grow overflow-hidden">
        {aside}
        <div className="flex-grow overflow-auto">{children}</div>
      </div>
    </div>
  );
}

export default Basic;
