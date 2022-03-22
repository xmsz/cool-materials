import { Balloon } from '@alifd/next';

export default (value: string) => (
  <Balloon.Tooltip
    align="t"
    className="next-light"
    style={{ maxWidth: '80vh' }}
    trigger={<div className="truncate w-max max-w-sm">{value}</div>}
  >
    {value}
  </Balloon.Tooltip>
);
