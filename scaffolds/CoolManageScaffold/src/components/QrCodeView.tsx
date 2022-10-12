import { DetailedHTMLProps, HTMLAttributes } from 'react';

const QrCodeView = ({
  src,
  ...props
}: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & { src: string }) => {
  return (
    <div className="border border-gray-200 rounded-lg relative" {...props}>
      <i className=" absolute  border-indigo-600 w-5 h-5 -top-[1px] -left-[1px] rounded-tl-lg border-t-2 border-l-2" />
      <i className=" absolute  border-indigo-600 w-5 h-5 -top-[1px] -right-[1px] rounded-tr-lg border-t-2 border-r-2" />
      <i className=" absolute  border-indigo-600 w-5 h-5 -bottom-[1px] -left-[1px] rounded-bl-lg border-b-2 border-l-2" />
      <i className=" absolute  border-indigo-600 w-5 h-5 -bottom-[1px] -right-[1px] rounded-br-lg border-b-2 border-r-2" />
      <img className="w-48 h-48" src={src} />
    </div>
  );
};

export default QrCodeView;
