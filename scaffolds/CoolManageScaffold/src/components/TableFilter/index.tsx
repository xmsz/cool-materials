import { Button, Overlay } from '@alifd/next';
import React, { ReactNode, useMemo, useState } from 'react';
import AddFiltersForm from './AddFiltersForm';
import { EFilterCommand, FILTER_COMMANDS } from './const';
import { Filter } from 'mongodb';

export interface IFilterItem<Field = string> {
  command: string;
  value: any;
  field: Field;
}

export type ITableFilters = Array<{
  [field: string]: {
    [command: string]: any;
  };
}>;
export interface ITableFilterProps<Field = string> {
  filters: Array<{
    name: string;
    field: string;
    commands: EFilterCommand[];
    form?: () => ReactNode;
    resultValueRender?: (val: any) => ReactNode;
  }>;
  value: Array<Filter<Record<string, unknown>>>;
  onSubmit: (value: IFilterItem<Field>, errors: any, field: any) => void;
  onRemove: (value: IFilterItem<Field>) => void;
}

export default ({ filters, value: curValue, onSubmit, onRemove }: ITableFilterProps) => {
  const [visible, setVisible] = useState(false);

  const filterList = useMemo(() => {
    if (!curValue) return [];
    const result: IFilterItem[] = [];

    curValue.forEach((item) => {
      const field = Object.keys(item)[0];
      if (!item[field]) return;
      const command = Object.keys(item[field]!)[0];
      const value = item[field]![command];

      result.push({ field, command, value });
    });

    return result;
  }, [curValue]);

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
          const filterItem = filters.find((childItem) => childItem.field === field);
          const commandItem = FILTER_COMMANDS.find((childItem) => childItem.value === command);
          return (
            <div
              // eslint-disable-next-line react/no-array-index-key
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
