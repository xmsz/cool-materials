import { PropsWithChildren, useRef, useState, useEffect } from 'react';
import { useDebounceFn, useSize } from 'ahooks';
import { Table } from '@alifd/next';
import { TableProps } from '@alifd/next/types/table';

export default ({
  children,
  wrapperClassName,
  ...tableProps
}: PropsWithChildren<{ wrapperClassName?: string } & TableProps>) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const size = useSize(ref);
  const [leftShadowVisible, setLeftShadowVisible] = useState(false);
  const [rightShadowVisible, setRightShadowVisible] = useState(false);
  const [hasScroll, setHasScroll] = useState(false);
  const { run: onScroll } = useDebounceFn(
    (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
      if (!hasScroll || !size || !ref.current) return;
      const { scrollLeft, scrollWidth } = ref.current;

      if (scrollLeft > 0) {
        setLeftShadowVisible(true);
        if (scrollLeft > scrollWidth - size.width) {
          setRightShadowVisible(false);
        } else {
          setRightShadowVisible(true);
        }
      } else {
        setLeftShadowVisible(false);
      }
    },
    {
      wait: 500,
    },
  );

  useEffect(() => {
    if (!size || !ref.current) return;
    const maxDistance = ref.current.scrollWidth - size.width;

    if (maxDistance > 0) {
      setHasScroll(true);
      setRightShadowVisible(true);
    }
  }, [size]);

  return (
    <div
      className={`relative  sm:rounded-lg border border-b-0 border-gray-200 shadow-sm overflow-hidden ${wrapperClassName}`}
    >
      <i
        className={`absolute  h-full w-2 left-0 top-0 z-10 transition-opacity ${
          leftShadowVisible ? 'opacity-20' : 'opacity-0'
        }`}
        style={{
          background: 'linear-gradient(90deg, rgb(192, 192, 207) 0%, rgba(0, 0, 0, 0) 100%)',
          boxShadow: 'rgb(33 33 52 / 10%) 0px 1px 4px',
        }}
      />

      <div ref={ref} className="overflow-x-auto" onScroll={onScroll}>
        <Table {...tableProps}>{children}</Table>
      </div>

      <i
        className={`absolute  h-full w-2 right-0 top-0 z-10 transition-opacity  ${
          rightShadowVisible ? 'opacity-20' : 'opacity-0'
        }`}
        style={{
          background: 'linear-gradient(270deg, rgb(192, 192, 207) 0%, rgba(0, 0, 0, 0) 100%)',
          boxShadow: 'rgb(33 33 52 / 10%) 0px 1px 4px',
        }}
      />
    </div>
  );
};
