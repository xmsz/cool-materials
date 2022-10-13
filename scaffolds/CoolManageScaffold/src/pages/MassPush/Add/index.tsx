import Edit from '../Edit';

const Add = () => {};
Add.show = (props: Parameters<typeof Edit['show']>[0]) => {
  return Edit.show({ type: 'add', ...props });
};
export default Add;
