import { Avatar } from '@alifd/next';

const TableUserInfo = ({
  avatar,
  nickname,
  id,
  hideName,
  desc,
  size,
}: {
  avatar?: string;
  nickname?: string;
  id?: string;
  hideName?: boolean;
  desc?: string;
  size?: 'small';
}) => {
  return (
    //   <Balloon.Tooltip
    //     // popupProps={{
    //     //   visible: nickname === '24',
    //     // }}
    //     align="t"
    //     trigger={
    //       <div className="text-xs text-gray-800 w-max cursor-pointer">
    //         <Avatar src={avatar} size={'small'} className="mr-2" />
    //         {hideName ? null : nickname}
    //       </div>
    //     }
    //   >
    //     <div className=" w-56 bg-gray-50 -mx-3 -mt-2  mb-0 pt-10 rounded-md overflow-hidden">
    //       <div className="bg-white px-3 pb-4 flex pt-1">
    //         <Avatar src={avatar} className="-mt-4 mr-3 border-3 border-white flex-shrink-0" size="large" />
    //         <div className=" overflow-hidden flex-grow">
    //           <b className="text-sm ">{nickname}</b>
    //           {id && (
    //             <div className="flex items-center overflow-hidden">
    //               <div className="  overflow-hidden">
    //                 <div className="text-gray-500 text-xs scale-75 origin-center-left truncate w-[130%]">{id}</div>
    //               </div>

    //               <Button
    //                 text
    //                 size="small"
    //                 type="secondary"
    //                 className="scale-85 flex-shrink-0"
    //                 onClick={() => {
    //                   setClipboard({
    //                     text: id,
    //                     success: () => {
    //                       Message.success('复制成功');
    //                     },
    //                   });
    //                 }}
    //               >
    //                 复制
    //               </Button>
    //             </div>
    //           )}
    //         </div>
    //       </div>
    //     </div>
    //   </Balloon.Tooltip>
    <div
      className={` text-gray-800 w-max cursor-pointer flex items-center ${size === 'small' ? 'text-xs' : 'text-sm'}`}
    >
      {avatar && <Avatar src={avatar} className={`${size === 'small' ? 'mr-2' : 'mr-3'}`} size={size} />}
      <div>
        {hideName ? null : nickname}
        <div className={`text-gray-400 text-xs scale-90 origin-bottom-left ${size === 'small' ? '' : 'mt-0.5'}`}>
          {desc}
        </div>
      </div>
    </div>
  );
};

export default TableUserInfo;
