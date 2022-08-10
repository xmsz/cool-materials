import { Nav } from '@alifd/next';
import Basic from '../Basic';
import { history, useLocation } from 'ice';
import { useEffect, useState } from 'react';
import { useLocalStorageState } from 'ahooks';

const NAV_LIST = [
  {
    label: '账号',
    icon: 'ic-round md-account_circle',
    children: [
      {
        label: '折扣码',
        value: '/discount_code/list',
      },
    ],
  },
];
function BasicWithAside(props) {
  const [selectedKeys, setSelectedKeys] = useState('');
  const location = useLocation();
  const [collapse, setCollapse] = useLocalStorageState('layout#aside_collapse', {
    defaultValue: false,
  });

  useEffect(() => {
    setSelectedKeys(location.pathname);
  }, [location.pathname]);

  const NavContent = (
    <Nav
      activeDirection={null}
      selectedKeys={selectedKeys}
      defaultOpenAll
      embeddable
      iconOnly={collapse}
      hasArrow={!collapse}
      mode={collapse ? 'popup' : 'inline'}
      popupStyle={{
        width: 120,
        textIndent: 20,
      }}
      popupClassName="rounded-lg shadow-popup overflow-hidden border border-gray-100"
    >
      {NAV_LIST.map((item) => (
        <Nav.SubNav
          label={item.label}
          className="p-0"
          icon={<i className={` align-middle -mt-0.5 ${collapse ? 'text-xl mr-4 ml-0.5' : 'mr-3'} ${item.icon}`} />}
          key={item.label}
        >
          {item.children.map((children) => (
            <Nav.Item
              key={children.value}
              onClick={() => {
                history?.push({
                  pathname: children.value,
                });
              }}
            >
              {children.label}
            </Nav.Item>
          ))}
        </Nav.SubNav>
      ))}
    </Nav>
  );

  return (
    <Basic
      {...props}
      navActiveDefault="设置"
      aside={
        <div className={` border-r border-gray-200 ${collapse ? 'w-14' : 'w-48'} flex flex-col justify-between`}>
          <header className="flex items-center justify-between px-4 pt-5 pb-4">
            {!collapse && <b className="block text-base font-bold text-gray-900">设置</b>}
            <i
              className={`ic-round ${
                collapse ? 'md-format_indent_increase' : 'md-format_indent_decrease'
              } text-base text-gray-300 cursor-pointer hover:text-gray-500 hover:bg-gray-50 rounded-full w-7 h-7 text-center leading-7`}
              onClick={() => {
                setCollapse(!collapse);
              }}
            />
          </header>
          <div className={`${collapse ? 'px-1' : 'px-4'} flex-grow`}>{NavContent}</div>
        </div>
      }
    />
  );
}

export default BasicWithAside;
