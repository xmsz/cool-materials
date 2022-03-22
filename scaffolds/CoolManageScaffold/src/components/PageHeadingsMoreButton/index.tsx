import { MenuButton } from '@alifd/next';
import { MenuButtonProps } from '@alifd/next/types/menu-button';

export default (props: MenuButtonProps) => {
  return (
    <MenuButton
      className="mr-2 next-menu-btn-arrow-hidden"
      style={{
        paddingLeft: '4px',
        paddingRight: '4px',
      }}
      popupProps={{
        v2: true,
        placement: 'br',
      }}
      label={<div className="w-4 h-4 text-gray-500 i-ic-sharp-more-vert" />}
      {...props}
    />
  );
};
