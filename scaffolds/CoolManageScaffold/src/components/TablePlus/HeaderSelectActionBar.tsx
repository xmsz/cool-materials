/* eslint-disable @typescript-eslint/indent */
import { Table } from '@alifd/next';
import { ColumnProps } from '@alifd/next/types/table';
import { PropsWithChildren } from 'react';
// @ts-ignore type
const { Header: TableHeader, Cell: TableCell } = Table;

const Button = ({
  children,
  icon,
  ...props
}: PropsWithChildren<
  React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & { icon?: string }
>) => {
  return (
    <button
      className="bg-transparent border-none hover:bg-white hover:bg-opacity-10 h-16 px-3 cursor-pointer text-white flex items-center gap-1"
      {...props}
    >
      {icon && <i className={`block ${icon} w-4 h-4`} />}
      {children}
    </button>
  );
};

const Divider = () => <i className="block h-5 w-1px bg-white bg-opacity-30 ml-6 mr-3" />;

const HeaderSelectActionBar = (props: PropsWithChildren<{ columns: ColumnProps[][]; selectedRowKeys: string[] }>) => (
  <TableHeader {...props}>
    <tr>
      <TableCell
        colSpan={props.columns[props.columns.length - 1].length}
        className={`next-no-padding bg-indigo-500 text-white text-sm py-0 ${
          props.selectedRowKeys.length > 0 ? '' : 'hidden'
        }`}
      >
        <div className={'flex items-center px-4'}>
          <span>已选择{props.selectedRowKeys.length}条记录</span>
          <Divider />
          {props.children}
        </div>
      </TableCell>
    </tr>
  </TableHeader>
);

HeaderSelectActionBar.Button = Button;
HeaderSelectActionBar.Divider = Divider;

export default HeaderSelectActionBar;
