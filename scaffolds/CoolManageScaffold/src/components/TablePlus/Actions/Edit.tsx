export default (props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>) => {
  return (
    <div
      {...props}
      className={`i-ic-sharp-edit w-4 h-4 bg-gray-500 bg-opacity-80 cursor-pointer hover:bg-opacity-100 ${props.className}`}
    />
  );
};
