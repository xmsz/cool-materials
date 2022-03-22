import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'ice';

export default ({ menuConfig }: { menuConfig: Array<{ label: string; value: string; icon?: string }> }) => {
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const location = useLocation();

  const curMenu = useMemo(
    () => menuConfig.find((item) => location.pathname.indexOf(item.value) > -1),
    [location.pathname, menuConfig],
  );

  useEffect(() => {
    if (curMenu && curMenu.value !== selectedKeys[0]) setSelectedKeys([curMenu.value]);
  }, [curMenu, location.pathname, selectedKeys]);

  return {
    selectedKeys,
  };
};
