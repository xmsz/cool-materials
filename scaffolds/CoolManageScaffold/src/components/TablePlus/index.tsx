import { Balloon, Menu, Overlay } from '@alifd/next';
import { MenuProps } from '@alifd/next/types/menu';
import { PopupProps } from '@alifd/next/types/overlay';
import { ReactNode } from 'react';
import ScrollTable from './ScrollTable';
import dayjs from 'dayjs';

const TablePlus = {
  Scroll: ScrollTable,
  Actions: {
    Delete: (props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>) => {
      return (
        <div
          {...props}
          className={`i-ic-sharp-delete w-4 h-4 text-gray-500 text-opacity-80  cursor-pointer hover:text-opacity-100 ${props.className}`}
        />
      );
    },
    Edit: (props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>) => {
      return (
        <div
          {...props}
          className={`i-ic-sharp-edit w-4 h-4 text-gray-500 text-opacity-80  cursor-pointer hover:text-opacity-100 ${props.className}`}
        />
      );
    },
    MenuButton: ({
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
            <div
              className={` w-4 h-4 text-gray-500 text-opacity-80 cursor-pointer hover:text-opacity-100 ${iconClassName}`}
            />
          }
          triggerType="click"
          {...popupProps}
        >
          <Menu {...menuProps} className={`shadow-popup border-none ${menuProps?.className}`}>
            {children}
          </Menu>
        </Overlay.Popup>
      );
    },
  },
  Cells: {
    Boolean: (value: boolean) => (
      <i
        className={`block i-ic-outline-check w-4 h-4 text-indigo-500 ${value ? 'text-opacity-100' : 'text-opacity-0'}`}
      />
    ),
    RichText: (value: string) => (
      <Balloon.Tooltip
        align="t"
        className="next-light"
        trigger={<div className="truncate w-max max-w-sm">{value}</div>}
      >
        {value}
      </Balloon.Tooltip>
    ),
    Enum: (
      value: any,
      index?: number,
      record?: any,
      context?: any,
      options?: {
        bgColor?: string;
        color?: string;
        label?: string;
      },
    ) => (
      <div
        className="text-xs rounded px-2 py-1 font-medium w-max"
        style={{
          backgroundColor: options?.bgColor || 'rgba(242, 243, 245, 0.5)',
          color: options?.color || 'rgb(78, 89, 105)',
        }}
      >
        {options?.label ?? value}
      </div>
    ),
    Date: (value: any) => dayjs(value).format('YYYY-MM-DD HH:mm:ss'),
  },
};

export default TablePlus;
