import { Message } from '@alifd/next';
import { clipboard } from '@uni/apis';
import { useHover } from 'ahooks';
import { useRef } from 'react';

export default ({ value }: { value: string }) => {
  const hoverRef = useRef<null | HTMLDivElement>(null);
  const isHover = useHover(hoverRef);

  return (
    <div ref={hoverRef}>
      <a href={value} target="_blank">
        {value}
      </a>
      <div
        className={`ml-2 inline-block align-middle cursor-pointer p-1 rounded ${
          isHover ? 'opacity-100 bg-gray-100' : 'opacity-0'
        }`}
        title="复制"
        onClick={() => {
          clipboard.setClipboard({
            text: value,
            success: Message.success('复制成功'),
          });
        }}
      >
        <i className={'block i-ic-sharp-copy-all w-3 h-3 bg-gray-400 hover:bg-gray-500'} />
      </div>
    </div>
  );
};
