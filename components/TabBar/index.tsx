/* eslint-disable max-len */
import { useControllableValue } from 'ahooks';
import { LocationListener } from 'history';
import { createElement, useEffect, CSSProperties } from 'rax';
import { history } from 'rax-app';

export default ({
  className,
  style,
  list,

  ...props
}: {
  className?: string;
  style?: CSSProperties;
  list: Array<{
    label: string;
    path: string;
    icon: string;
    onClick: () => void;
  }>;
  value?: string;
  defaultValue?: string;
}) => {
  const [activeKey, setActiveKey] = useControllableValue(props, {
    defaultValue: history?.location.pathname,
  });

  useEffect(() => {
    if (!history) return;

    const handler: LocationListener = (location) => {
      const { pathname } = location;
      setActiveKey(pathname.split('?')[0]);
    };

    history.listen(handler);
    handler(history.location, 'REPLACE');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={`fixed bottom-0 w-full bg-white z-20 ${className}`} style={style}>
      <ul
        className={'grid gap-2'}
        style={{
          gridTemplateColumns: `repeat(${list.length}, minmax(0, 1fr))`,
        }}
      >
        {list.map((item) => (
          <li
            key={item.label}
            className={`text-xs  text-center py-1 ${activeKey === item.path ? 'text-gray-800' : 'text-gray-400'}`}
            onClick={item.onClick}
          >
            {typeof item.icon === 'string' ? (
              <span className={`block w-6 h-6 mx-auto  ic ${item.icon} leading-6 bg-cover bg-center text-xl`} />
            ) : (
              item.icon
            )}

            <span className="block scale-90 origin-center">{item.label}</span>
          </li>
        ))}
      </ul>
      <div className="safe-pb" />
    </div>
  );
};
