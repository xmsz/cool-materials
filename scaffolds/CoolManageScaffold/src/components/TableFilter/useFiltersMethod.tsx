import { ITableFilterProps, ITableFilters } from '@/components/TableFilter';
import { Field } from '@alifd/next';
import { useMemoizedFn } from 'ahooks';
import equal from 'deep-is';

export default <IRecord extends {}>({
  field,
  onSubmit,
  transformValue,
}: {
  field: Field;
  onSubmit: () => void;
  transformValue: {
    numberField: Array<keyof IRecord>;
  };
}) => {
  type IFilterProps = ITableFilterProps<keyof IRecord>;
  const handleSubmit = useMemoizedFn<IFilterProps['onSubmit']>((payload) => {
    const filters = field.getValue<ITableFilters>('filters') || [];
    field.setValue('filters', [
      ...filters,
      {
        [payload.field]: {
          [payload.command]: transformValue.numberField.includes(payload.field) ? Number(payload.value) : payload.value,
        },
      },
    ]);

    onSubmit();
  });
  const handleRemove = useMemoizedFn<IFilterProps['onRemove']>((payload) => {
    const filters = field.getValue<ITableFilters>('filters') || [];
    field.setValue(
      'filters',
      filters.filter(
        (item) =>
          !equal(item, {
            [payload.field]: {
              [payload.command]: payload.value,
            },
          }),
      ),
    );
    onSubmit();
  });

  return {
    handleRemove,
    handleSubmit,
  };
};
