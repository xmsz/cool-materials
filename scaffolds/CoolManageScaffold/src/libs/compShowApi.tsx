/* eslint-disable @typescript-eslint/indent */

import { ConfigProvider } from '@alifd/next';
import { useState, ComponentType, useImperativeHandle, forwardRef, Ref } from 'react';
import ReactDom from 'react-dom';
import store from '@/store';
import { ConfigProvideConfig } from '@/configs/ConfigProvider';

const CompWrapperRaw = <T extends { onClose?: () => void }>(
  {
    Comp,
    props,
    afterClose,
  }: {
    Comp: ComponentType<T>;
    props: T & { visible?: boolean; afterClose?: () => void };
    afterClose: () => void;
  },
  ref: Ref<{ hide: () => void }>,
) => {
  const [visible, setVisible] = useState(true);

  useImperativeHandle(ref, () => ({
    hide: () => {
      setVisible(false);
    },
  }));

  return (
    <ConfigProvider
      // @ts-ignore type
      defaultPropsConfig={ConfigProvideConfig}
    >
      <store.Provider>
        <Comp
          {...props}
          visible={visible}
          onClose={() => {
            setVisible(false);
            props.onClose?.();
          }}
          afterClose={() => {
            afterClose();
            props.afterClose?.();
          }}
        />
      </store.Provider>
    </ConfigProvider>
  );
};
const CompWrapper = forwardRef(CompWrapperRaw);

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

  let instance: { hide: () => void } | null;

  ReactDom.render(
    <CompWrapper
      Comp={Comp}
      ref={(ref) => {
        instance = ref;
      }}
      props={props}
      afterClose={() => {
        unmount();
      }}
    />,
    container,
    () => {},
  );

  return {
    hide: () => {
      instance?.hide();
    },
  };
};

export default compShowApi;
