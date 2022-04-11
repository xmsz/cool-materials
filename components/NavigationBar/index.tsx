import { useMount } from 'ahooks';
import { Icon } from '@alifd/meet';
import { createElement, CSSProperties, RaxNode, useState } from 'rax';
import { isWeChatMiniProgram } from 'universal-env';

import styles from './index.module.css';
import { INavigationBarInfo, initNavigationInfo } from './navigationBar';

export default ({
  onBack,
  backProps,
  back = true,
  placeholder = true,
  title,
  brightness = 'light',
  titleAlign = 'center',
  background,
  content,
}: {
  placeholder?: boolean;
  back?: boolean;
  onBack?: () => void;
  backProps?: { style: CSSProperties };
  title?: string | RaxNode;
  brightness?: 'light' | 'dark';
  titleAlign?: 'left' | 'center' | 'right';
  background?: string;
  content?: string | RaxNode;
}) => {
  const [data, setData] = useState<INavigationBarInfo>({
    navigationBarHeight: 64,
    statusBarHeight: 20,
    capsulePosition: { bottom: 0, height: 0, left: 0, right: 0, top: 0, width: 0 },
  });

  useMount(async () => {
    if (isWeChatMiniProgram) {
      const navigationBarInfo = initNavigationInfo();
      setData(navigationBarInfo);
    }
  });

  return (
    <>
      {placeholder && (
        <div
          style={{
            height: `${data.navigationBarHeight}px`,
          }}
        />
      )}

      <div
        className={`${styles.NavigationBar} ${
          brightness === 'light' ? styles.NavigationBarLight : styles.NavigationBarDark
        }`}
        style={{
          height: `${data.navigationBarHeight}px`,
          background,
        }}
      >
        <div
          style={{
            flexShrink: 0,
            height: `${data.statusBarHeight}px`,
          }}
        />

        <div className={styles.Content}>
          {back && <Icon className={styles.BtnBack} type="arrow-left" onClick={onBack} {...backProps} />}
          <div
            style={{
              flexGrow: 1,
            }}
          >
            {content}

            <b
              className={`${styles.Title} ${titleAlign === 'center' && styles.TitleCenter}`}
              style={{ textAlign: titleAlign }}
            >
              {title}
            </b>
          </div>

          {data.capsulePosition.width ? (
            <div
              style={{
                flexShrink: 0,
                width: data.capsulePosition.width * 2,
                height: data.capsulePosition.height * 2,
                marginRight: `calc(100vw - ${data.capsulePosition.right}px)`,
              }}
            />
          ) : null}
        </div>
      </div>
    </>
  );
};
