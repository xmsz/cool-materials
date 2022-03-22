import { Overlay, Menu } from '@alifd/next';
import { MenuProps } from '@alifd/next/types/menu';
import { PopupProps } from '@alifd/next/types/overlay';
import { ReactNode } from 'react';

export default ({
  iconClassName,
  popupProps,
  menuProps,
  children,
}: {
  iconClassName?: string;
  popupProps?: PopupProps;
  menuProps?: MenuProps;
  children?: ReactNode;
}) => {
  return (
    <Overlay.Popup
      trigger={
        <div className={` w-4 h-4 bg-gray-500 bg-opacity-80 cursor-pointer hover:bg-opacity-100 ${iconClassName}`} />
      }
      triggerType="click"
      {...popupProps}
    >
      <Menu {...menuProps} className={`shadow-popup border-none ${menuProps?.className}`}>
        {children}
      </Menu>
    </Overlay.Popup>
  );
};
