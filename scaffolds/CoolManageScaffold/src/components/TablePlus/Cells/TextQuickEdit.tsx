import { Balloon, Input, Button } from '@alifd/next';
import { useHover } from 'ahooks';
import { useRef, useState } from 'react';

export default ({ value, onOk }: { value: string; onOk?: (value: string) => void }) => {
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
            title="编辑"
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
              onOk?.(state);
            }}
          >
            确认
          </Button>
        </div>
      </Balloon.Tooltip>
    </div>
  );
};
