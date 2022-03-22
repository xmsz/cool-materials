import { useResponsive } from 'ahooks';
import { useMemo } from 'react';

export default () => {
  const responsive = useResponsive();
  const device = useMemo(() => {
    return responsive.xl ? 'desktop' : 'phone';
  }, [responsive]);

  return device;
};
