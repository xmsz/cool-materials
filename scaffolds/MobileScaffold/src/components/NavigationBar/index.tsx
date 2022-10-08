import { useMount } from 'ahooks';
import { createElement, CSSProperties, RaxNode, useState } from 'rax';

import styles from './index.module.css';
import { INavigationBarInfo, initNavigationInfo } from './navigationBar';
import createIntersectionObserver from '@uni/intersection-observer';
import { isWeb, isWeChatMiniProgram } from '@uni/env';

export default (props: {
  placeholder?: boolean;
  back?: boolean;
  onBack?: () => void;
  backProps?: { style: CSSProperties };
  title?: string | RaxNode;
  brightness?: 'light' | 'dark';
  titleAlign?: 'left' | 'center' | 'right';
  background?: string;
  content?: string | RaxNode;
  intersectBackground?: string;
  placeholderClassName?: string;
  fixed?: boolean;
}) => {
  const {
    onBack,
    backProps,
    back = true,
    placeholder = true,
    title,
    brightness = 'light',
    titleAlign = 'center',
    background = 'transparent',
    content,
    intersectBackground = background,
    placeholderClassName,
    fixed = true,
  } = props;
  const [data, setData] = useState<INavigationBarInfo>({
    navigationBarHeight: isWeb ? 48 : 64,
    statusBarHeight: isWeb ? 0 : 20,
    capsulePosition: { bottom: 0, height: 0, left: 0, right: 0, top: 0, width: 0 },
  });
  const [isIntersect, setIsIntersect] = useState(false);

  useMount(async () => {
    if (isWeChatMiniProgram) {
      const navigationBarInfo = initNavigationInfo();
      setData(navigationBarInfo);
    }
  });

  useMount(() => {
    // NOTICE: 暂时仅支持首次
    if (!placeholder || !fixed) return;

    const node = document.querySelector('.navigation-bar-placeholder');
    if (!node) return;
    setTimeout(() => {
      const intersectionObserver = createIntersectionObserver({ thresholds: [0] }, node['_internal']);

      intersectionObserver
        .relativeToViewport({
          bottom: 0,
        })
        .observe('.navigation-bar-placeholder', (res) => {
          setIsIntersect(res.intersectionRatio === 0);
        });
    }, 0);
  });

  return (
    <>
      {placeholder && fixed && (
        <div
          style={{
            height: `${data.navigationBarHeight}px`,
          }}
          className={`navigation-bar-placeholder ${placeholderClassName}`}
        />
      )}

      <div
        className={`${styles.NavigationBar} ${
          brightness === 'light' ? styles.NavigationBarLight : styles.NavigationBarDark
        }`}
        style={{
          height: `${data.navigationBarHeight}px`,
          background: isIntersect ? intersectBackground : background,
          position: fixed ? 'fixed' : 'relative',
        }}
      >
        <div
          className="cool-navigation-bar-status-bar"
          style={{
            flexShrink: 0,
            height: `${data.statusBarHeight}px`,
          }}
        />

        <div className={styles.Content}>
          {back && (
            <div
              className={`${styles.BtnBack} ic-round md-arrow_back_ios`}
              type="arrow-left"
              onClick={onBack}
              {...backProps}
            />
          )}
          <div
            style={{
              flexGrow: 1,
            }}
          >
            {content}

            <b
              className={`${styles.Title} ${titleAlign === 'center' && styles.TitleCenter}`}
              style={{ textAlign: titleAlign, fontWeight: 500 }}
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
