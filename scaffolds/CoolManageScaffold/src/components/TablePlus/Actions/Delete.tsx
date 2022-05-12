import { Balloon, Message, Button } from '@alifd/next';
import { MessageProps } from '@alifd/next/types/message';
import { useRef } from 'react';

export default ({
  messageProps,
  onOk,
  ...props
}: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
  messageProps?: MessageProps;
  onOk?: () => void;
}) => {
  const ref = useRef<null | HTMLDivElement>(null);

  return (
    <Balloon.Tooltip
      triggerType={'click'}
      trigger={
        <div
          {...props}
          className={`i-ic-sharp-delete w-4 h-4 bg-gray-500 bg-opacity-80 cursor-pointer hover:bg-opacity-100 ${props.className}`}
          ref={ref}
        />
      }
      className="next-light"
      align="br"
      arrowPointToCenter
    >
      <Message
        type="warning"
        title="确认是否删除"
        shape="addon"
        style={{
          padding: 0,
        }}
        {...messageProps}
      />
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
          warning
          onClick={() => {
            ref.current?.click();
            onOk?.();
          }}
        >
          删除
        </Button>
      </div>
    </Balloon.Tooltip>
  );
};
