import { Input, ConfigProvider, Balloon } from '@alifd/next';
import { BalloonProps } from '@alifd/next/types/balloon';
import { TextAreaProps } from '@alifd/next/types/input';
import { useMemoizedFn } from 'ahooks';
import { cloneElement, DetailedHTMLProps, LiHTMLAttributes, useRef } from 'react';
// import wechatEmojiPlus from 'wechat-emoji-plus';

const BtnItem = ({
  children,
  icon,
  ...props
}: DetailedHTMLProps<LiHTMLAttributes<HTMLLIElement>, HTMLLIElement> & {
  icon?: string;
}) => {
  return (
    <li
      {...props}
      // className={`flex items-center font-bold text-gray-600 bg-white pl-1.5 pr-2 my-1 mr-1 py-1 cursor-pointer w-max text-xs border border-gray-200 hover:text-gray-800  rounded-full ${props.className} `}
      className={`flex items-center  text-gray-700 border border-gray-200 scale-90 origin-left bg-white  px-2 my-1 py-1 cursor-pointer w-max text-xs  hover:text-gray-800 hover:border-gray-300  rounded-full ${props.className} `}
    >
      <i className={`text-gray-300 ${icon}`} />
      {children}
    </li>
  );
};

const Btn = ({
  children,
  icon,
  balloonProps,
  onSubmit,
  ...props
}: Omit<React.DetailedHTMLProps<React.LiHTMLAttributes<HTMLLIElement>, HTMLLIElement>, 'onSubmit'> & {
  icon?: string;
  balloonProps?: BalloonProps;
  onSubmit?: (val: string) => void;
}) => {
  const content = (
    <li {...props} className={`flex items-center gap-0.5 p-1 cursor-pointer w-max text-xs ${props.className}`}>
      <i className={` text-lg text-gray-300 ${icon}`} />
      {children}
    </li>
  );

  return balloonProps ? (
    <Balloon
      trigger={content}
      triggerType="click"
      align={'tl'}
      v2
      // visible={visible}
      popupStyle={{
        padding: 0,
        maxWidth: 600,
      }}
      // onClose={() => {
      //   setVisible(false);
      // }}

      {...balloonProps}
    >
      {cloneElement(balloonProps.children, {
        onSubmit,
      })}
    </Balloon>
  ) : (
    content
  );
};

const Preview = ({ content }: { content: string }) => {
  return (
    <div
      className=" rounded-md bg-white w-full text-gray-900 text-sm py-3 px-4 border border-gray-200 whitespace-pre-wrap break-all max-w-max"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{
        // __html: wechatEmojiPlus.convertHTML(content),
        __html: content,
      }}
    />
  );
};

type TextArea2Ref = {
  getInputNode: () => HTMLInputElement;
  focus: () => void;
} | null;
const TextArea2Raw = ({
  actions,
  wrapperClassName,
  tools,
  ...props
}: TextAreaProps & {
  wrapperClassName?: string;
  actions?: Array<{
    label: string;
    value: string;
    icon?: string;
  }>;
  tools?: Array<{
    label: string;
    value?: string;
    icon?: string;
    balloonProps?: BalloonProps;
  }>;
  onChange?: (value: string) => void;
  isPreview?: boolean;
}) => {
  const ref = useRef<TextArea2Ref>(null);

  const insertOnCursor = useMemoizedFn((text: string) => {
    const input = ref.current!.getInputNode();
    const { selectionStart } = input;
    if (typeof selectionStart !== 'number') return;

    const newValue = input.value.substring(0, selectionStart) + text + input.value.substring(input.selectionEnd!);
    props.onChange?.(newValue);

    input.focus();
    setTimeout(() => {
      input.setSelectionRange(selectionStart + text.length, selectionStart + text.length);
    }, 0);
  });

  return (
    <div className={`relative ${wrapperClassName}`}>
      <Input.TextArea
        style={{
          paddingBottom: actions ? 38 : 0,
          paddingTop: tools ? 38 : 0,
        }}
        // @ts-ignore type
        ref={ref}
        renderPreview={(value: string) => <Preview content={value} />}
        className="w-full"
        {...props}
      />

      {tools && (
        <div
          className={`rounded-t-md  top-[1px] bg-white  w-full border-b border-gray-200 px-1 ${
            props.isPreview ? 'hidden' : 'absolute'
          }`}
          style={{
            width: 'calc(100% - 2px)',
            left: 1,
          }}
        >
          <ul className="flex items-center justify-between">
            {tools.map((item) => (
              <Btn
                key={item.value || item.label}
                icon={item.icon}
                balloonProps={item.balloonProps}
                onSubmit={(value) => {
                  insertOnCursor(value);
                }}
              >
                {item.label}
              </Btn>
            ))}
          </ul>
        </div>
      )}

      {actions && (
        <div
          // className={`rounded-b-md  bottom-[1px]   w-full  px-1 ${  props.isPreview ? 'hidden' : 'absolute' } flex items-center bg-gray-50 border-t border-gray-200 border-opacity-70`}
          className={`rounded-b-md  bottom-[1px]   w-full  px-1 ${
            props.isPreview ? 'hidden' : 'absolute'
          } flex items-center  `}
          style={{
            width: 'calc(100% - 2px)',
            left: 1,
          }}
        >
          <span className="text-xs scale-90 pl-1">变量：</span>
          <ul className="flex items-center ">
            {actions.map((item) => (
              <BtnItem
                key={item.value}
                onClick={() => {
                  insertOnCursor(item.value);
                }}
              >
                {item.label}
              </BtnItem>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

TextArea2Raw.Btn = Btn;
const TextArea2 = ConfigProvider.config(TextArea2Raw) as typeof TextArea2Raw;
export default TextArea2;
