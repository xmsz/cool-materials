import { Balloon, Button, Input, Menu, Message, Overlay } from '@alifd/next';
import { MenuProps } from '@alifd/next/types/menu';
import { PopupProps } from '@alifd/next/types/overlay';
import { ReactNode, useRef, useState } from 'react';
import ScrollTable from './ScrollTable';
import dayjs from 'dayjs';
import { MessageProps } from '@alifd/next/types/message';
import { useHover } from 'ahooks';
import HeaderSelectActionBar from './HeaderSelectActionBar';

const TablePlus = {
  Scroll: ScrollTable,
  Actions: {
    Delete: ({
      messageProps,
      onOk,
      ...props
    }: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
      messageProps?: MessageProps;
      onOk?: () => void;
    }) => {
      const ref = useRef<null | HTMLDivElement>(null);

      return (
        <Balloon.Tooltip
          triggerType={'click'}
          trigger={
            <div
              {...props}
              className={`i-ic-sharp-delete w-4 h-4 bg-gray-500 bg-opacity-80 cursor-pointer hover:bg-opacity-100 ${props.className}`}
              ref={ref}
            />
          }
          className="next-light"
          align="br"
          arrowPointToCenter
        >
          <Message
            type="warning"
            title="确认是否删除"
            shape="addon"
            style={{
              padding: 0,
            }}
            {...messageProps}
          />
          <div className="flex justify-end gap-2 mt-3">
            <Button
              size="small"
              onClick={() => {
                ref.current?.click();
              }}
            >
              取消
            </Button>
            <Button
              size="small"
              warning
              onClick={() => {
                ref.current?.click();
                onOk?.();
              }}
            >
              删除
            </Button>
          </div>
        </Balloon.Tooltip>
      );
    },
    Edit: (props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>) => {
      return (
        <div
          {...props}
          className={`i-ic-sharp-edit w-4 h-4 bg-gray-500 bg-opacity-80 cursor-pointer hover:bg-opacity-100 ${props.className}`}
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
              className={` w-4 h-4 bg-gray-500 bg-opacity-80 cursor-pointer hover:bg-opacity-100 ${iconClassName}`}
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
    TextOverflow: (value: string) => (
      <Balloon.Tooltip
        align="t"
        className="next-light"
        style={{ maxWidth: '80vh' }}
        trigger={<div className="truncate w-max max-w-sm">{value}</div>}
      >
        {value}
      </Balloon.Tooltip>
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
    TextQuickEdit: (
      value: string,
      index?: number,
      record?: any,
      context?: any,
      options?: {
        onOk?: (value: string) => void;
      },
    ) => {
      const Comp = () => {
        const ref = useRef<null | HTMLDivElement>(null);
        const hoverRef = useRef<null | HTMLDivElement>(null);

        const [state, setState] = useState(value);
        const isHover = useHover(hoverRef);
        const [isOpen, setIsOpen] = useState(false);

        return (
          <div ref={hoverRef}>
            {value}
            <Balloon.Tooltip
              triggerType={'click'}
              trigger={
                <div
                  className={` ml-2 inline-block align-middle cursor-pointer p-1 rounded ${
                    isHover || isOpen ? 'opacity-100 bg-gray-100' : 'opacity-0'
                  }`}
                >
                  <i className={'block i-ic-sharp-edit w-3 h-3 bg-gray-400 hover:bg-gray-500'} ref={ref} />
                </div>
              }
              className="next-light"
              align="bl"
              arrowPointToCenter
              popupProps={{
                onVisibleChange: setIsOpen,
              }}
            >
              <div className=" font-medium text-gray-800 mb-2 w-56">修改</div>
              <Input className="w-full" defaultValue={value} onChange={setState} />

              <div className="flex justify-end gap-2 mt-4">
                <Button
                  size="small"
                  onClick={() => {
                    ref.current?.click();
                  }}
                >
                  取消
                </Button>
                <Button
                  size="small"
                  type="primary"
                  onClick={() => {
                    ref.current?.click();
                    options?.onOk?.(state);
                  }}
                >
                  确认
                </Button>
              </div>
            </Balloon.Tooltip>
          </div>
        );
      };

      return <Comp />;
    },
  },
  Header: {
    SelectActionBar: HeaderSelectActionBar,
  },
};

export default TablePlus;
