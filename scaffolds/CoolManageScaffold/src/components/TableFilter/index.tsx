import { Button, Overlay } from '@alifd/next';
import { ReactNode, useMemo, useState } from 'react';
import AddFiltersForm from './AddFiltersForm';
import { EFilterCommand, FILTER_COMMANDS } from './const';
import { Filter } from 'mongodb';

interface IFilterItem {
  command: string;
  value: any;
  field: string;
}

export default ({
  filters,
  value,
  onSubmit,
  onRemove,
}: {
  filters: Array<{
    name: string;
    field: string;
    commands: EFilterCommand[];
    form?: () => ReactNode;
    resultValueRender?: (val: any) => ReactNode;
  }>;
  value: Array<Filter<Record<string, unknown>>>;
  onSubmit: (value: IFilterItem, errors: any, field: any) => void;
  onRemove: (value: IFilterItem) => void;
}) => {
  const [visible, setVisible] = useState(false);

  const filterList = useMemo(() => {
    if (!value) return [];
    const result: Array<IFilterItem> = [];

    value.forEach((item) => {
      const field = Object.keys(item)[0];
      if (!item[field]) return;
      const command = Object.keys(item[field]!)[0];
      const value = item[field]![command];

      result.push({ field, command, value });
    });

    return result;
  }, [value]);

  return (
    <div className="items-center flex flex-wrap">
      <Overlay.Popup
        visible={visible}
        trigger={
          <Button
            onClick={() => {
              setVisible((prev) => !prev);
            }}
          >
            <svg className="w-5 h-5 mr-1" viewBox="0 0 24 24">
              <path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z" />
            </svg>
            筛选
          </Button>
        }
      >
        <div className="bg-white mt-1 shadow-popup rounded-md text-base sm:text-sm p-5 w-64 pb-2">
          <AddFiltersForm
            filters={filters}
            onSubmit={(values, errors, field) => {
              if (errors) return;
              setVisible(false);
              onSubmit(values, errors, field);
            }}
          />
        </div>
      </Overlay.Popup>
      <div className="flex gap-2 mt-2 flex-wrap sm:ml-2 sm:mt-0">
        {filterList.map((item, itemIdx) => {
          const { field, command, value } = item;
          const filterItem = filters.find((item) => item.field === field);
          const commandItem = FILTER_COMMANDS.find((item) => item.value === command);
          return (
            <div
              key={`${field}-${itemIdx}`}
              className="flex items-center border border-indigo-200 bg-indigo-50 rounded text-indigo-800 font-medium py-2 px-3"
            >
              {filterItem?.name} {commandItem?.label}{' '}
              {filterItem?.resultValueRender ? filterItem.resultValueRender(value) : value}
              <div className=" border-t-0 border-l-0 border-b-0 border-r border-indigo-200 h-4 mx-2 " />
              <i
                className="i-ic-twotone-close -mr-1 cursor-pointer"
                onClick={() => {
                  onRemove(item);
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
