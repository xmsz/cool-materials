import { PropsWithChildren, useRef, useMemo } from 'react';
import { useScroll, useSize } from 'ahooks';
import { Table } from '@alifd/next';
import { TableProps } from '@alifd/next/types/table';

export default ({
  children,
  wrapperClassName,
  ...tableProps
}: PropsWithChildren<{ wrapperClassName?: string } & TableProps>) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const scroll = useScroll(ref);
  const size = useSize(ref);

  const rightCoverVisible = useMemo(() => {
    if (!size || !scroll || !ref.current) return false;
    const maxDistance = ref.current.scrollWidth - size.width;
    if (maxDistance === 0) return false;

    return scroll.left < maxDistance;
  }, [size, scroll]);

  return (
    <div
      className={`relative  sm:rounded-lg border border-b-0 border-gray-200 shadow-sm overflow-hidden ${wrapperClassName}`}
    >
      {scroll && scroll.left > 0 && (
        <i
          className="absolute opacity-20 h-full w-2 left-0 top-0 z-10"
          style={{
            background: 'linear-gradient(90deg, rgb(192, 192, 207) 0%, rgba(0, 0, 0, 0) 100%)',
            boxShadow: 'rgb(33 33 52 / 10%) 0px 1px 4px',
          }}
        />
      )}
      <div ref={ref} className="overflow-x-auto">
        <Table {...tableProps}>{children}</Table>
      </div>
      {rightCoverVisible && (
        <i
          className="absolute opacity-20 h-full w-2 right-0 top-0 z-10"
          style={{
            background: 'linear-gradient(270deg, rgb(192, 192, 207) 0%, rgba(0, 0, 0, 0) 100%)',
            boxShadow: 'rgb(33 33 52 / 10%) 0px 1px 4px',
          }}
        />
      )}
    </div>
  );
};
