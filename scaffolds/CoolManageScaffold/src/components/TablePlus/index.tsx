import ScrollTable from './ScrollTable';
import dayjs from 'dayjs';
import HeaderSelectActionBar from './HeaderSelectActionBar';
import TextQuickEdit from './Cells/TextQuickEdit';
import Link from './Cells/Link';
import Delete from './Actions/Delete';
import Edit from './Actions/Edit';
import MenuButton from './Actions/MenuButton';
import Boolean from './Cells/Boolean';
import TextOverflow from './Cells/TextOverflow';
import RichText from './Cells/RichText';
import Enum from './Cells/Enum';

const TablePlus = {
  Scroll: ScrollTable,
  Actions: {
    Delete,
    Edit,
    MenuButton,
  },
  Cells: {
    Boolean,
    TextOverflow,
    RichText,
    Enum,
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
      return <TextQuickEdit value={value} onOk={options?.onOk} />;
    },
    Link: (value: string) => {
      return <Link value={value} />;
    },
  },
  Header: {
    SelectActionBar: HeaderSelectActionBar,
  },
};

export default TablePlus;
