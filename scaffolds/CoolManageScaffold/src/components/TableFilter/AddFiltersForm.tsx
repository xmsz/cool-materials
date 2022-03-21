/* eslint-disable @typescript-eslint/indent */
import { Field, Form, Input, Select } from '@alifd/next';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import { FILTER_COMMANDS } from './const';

export default ({
  filters,
  onSubmit,
}: {
  filters: Array<{
    name: string;
    field: string;
    commands: string[];
    form?: () => ReactNode;
  }>;
  onSubmit: (value: { field: string; command: string; value: any }, errors: any, field: any) => void;
}) => {
  const [state, setState] = useState({
    field: '',
    command: '',
    value: '',
  });
  const field = Field.useField({
    onChange: (name, value) => setState((prev) => ({ ...prev, [name]: value })),
  });

  const currentField = useMemo(() => filters.find((item) => item.field === state.field), [filters, state.field]);

  useEffect(() => {
    // STEP: 设置默认值
    if (!state.field && filters.length) {
      const defaultValues = {
        field: filters[0].field,
        command: filters[0].commands[0],
        value: '',
      };
      field.setValues(defaultValues);
      setState(defaultValues);
    }
  }, [filters, state]);

  return (
    <Form field={field} onChange={setState}>
      <Form.Item name="field" fullWidth>
        <Select dataSource={filters.map((item) => ({ label: item.name, value: item.field }))} autoWidth showSearch />
      </Form.Item>
      <Form.Item name="command" fullWidth>
        <Select
          dataSource={FILTER_COMMANDS.filter((item) => currentField?.commands.includes(item.value))}
          autoWidth
          placeholder=" "
          showSearch
        />
      </Form.Item>
      <Form.Item name="value" fullWidth required>
        {currentField?.form || <Input />}
      </Form.Item>
      <Form.Item fullWidth>
        <Form.Submit type="primary" className="w-full" validate onClick={onSubmit}>
          新增筛选条件
        </Form.Submit>
      </Form.Item>
    </Form>
  );
};
