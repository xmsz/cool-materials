export default (
  value: any,
  index?: number,
  record?: any,
  context?: any,
  options?: {
    bgColor?: string;
    color?: string;
    label?: string;
  },
) => (
  <div
    className="text-xs rounded px-2 py-1 font-medium w-max"
    style={{
      backgroundColor: options?.bgColor || 'rgba(242, 243, 245, 0.5)',
      color: options?.color || 'rgb(78, 89, 105)',
    }}
  >
    {options?.label ?? value}
  </div>
);
