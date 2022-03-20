/* eslint-disable @typescript-eslint/indent */
import { defaultPropsConfig } from '@/layouts/BasicLayout';
import { ConfigProvider } from '@alifd/next';
import { useState, ComponentType } from 'react';
import ReactDom from 'react-dom';

const CompWrapper = <T extends { onClose?: () => void }>({
  Comp,
  props,
}: {
  Comp: ComponentType<T>;
  props: T & { visible?: boolean; afterClose?: () => void };
}) => {
  const [visible, setVisible] = useState(true);
  return (
    <ConfigProvider
      // @ts-ignore type
      defaultPropsConfig={defaultPropsConfig}
    >
      <Comp
        {...props}
        visible={visible}
        onClose={() => {
          setVisible(false);
          props.onClose?.();
        }}
      />
    </ConfigProvider>
  );
};

type ICompShowApi = <T>(
  Comp: ComponentType<T>,
  props: T & {
    visible?: boolean;
    afterClose?: () => void;
  },
) => {
  hide: () => void;
};

const compShowApi: ICompShowApi = (Comp, props) => {
  const container = document.createElement('div');
  const unmount = () => {
    ReactDom.unmountComponentAtNode(container);
    container.parentNode?.removeChild(container);
  };

  document.body.appendChild(container);

  let instance: any;
  let myRef;

  ReactDom.render(
    <CompWrapper
      Comp={Comp}
      props={{
        ...props,
        afterClose: () => {
          unmount();
        },
        ref: (ref) => {
          myRef = ref;
        },
      }}
    />,

    container,
    () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      instance = myRef;
    },
  );

  return {
    hide: () => {
      // TODO
      // instance?.getInstance()
    },
  };
};

export default compShowApi;
