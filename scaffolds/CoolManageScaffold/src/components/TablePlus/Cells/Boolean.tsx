export default (value: boolean) => (
  <i className={`block i-ic-outline-check w-4 h-4 text-indigo-500 ${value ? 'text-opacity-100' : 'text-opacity-0'}`} />
);
