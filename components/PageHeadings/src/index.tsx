import { Button } from '@alifd/next';
import { ButtonProps } from '@alifd/next/types/button';
import * as React from 'react';
import { ReactNode } from 'react';

export interface PageHeadingsProps {
  /** 描述 */
  desc?: string | ReactNode;
  /** 按钮 */
  actions?: ButtonProps[];
  /** 标题 */
  title?: string | ReactNode;
  /** 额外 */
  extra?: string | ReactNode;
}

export default ({ desc, actions, title, extra }: PageHeadingsProps) => {
  return (
    <div className="lg:flex lg:items-center lg:justify-between">
      <div className="flex-1 min-w-0">
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">{title}</h2>
        {desc && <div className="mt-1 text-sm text-gray-500  sm:mt-2 ">{desc}</div>}
      </div>
      <div className="mt-5 flex lg:mt-0 lg:ml-4">
        {extra}
        {actions?.map((actionProps, actionIdx) => (
          <Button
            // eslint-disable-next-line react/no-array-index-key
            key={actionIdx}
            className={`${actionIdx > 0 ? 'sm:ml-3' : ''} ${actionProps.className}`}
            {...actionProps}
          >
            {actionProps.children}
          </Button>
        ))}
      </div>
    </div>
  );
};
