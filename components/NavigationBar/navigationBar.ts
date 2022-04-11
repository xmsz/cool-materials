/**
 * - 支持onWindowResize调整
 * - 缓存数据
 */

import { isWeChatMiniProgram } from 'universal-env';

export interface TAnyObject {
  [prop: string]: any;
}

function simpleCopyObject<RESULT = TAnyObject>(object: TAnyObject) {
  return JSON.parse(JSON.stringify(object)) as RESULT;
}

export interface INavigationBarInfo {
  navigationBarHeight: number;
  capsulePosition: {
    bottom: number;
    height: number;
    left: number;
    right: number;
    top: number;
    width: number;
  };
  statusBarHeight: number;
}

let navigationBarInfo: INavigationBarInfo | null = null;

function getInitialGap(payload: { isIos: boolean; isAndroid: boolean; isDevTool: boolean }) {
  const { isIos, isAndroid, isDevTool } = payload;
  let gap = 0;
  let width = 96; // 胶囊的宽度
  // STEP: 设置间距 写死的？
  if (isAndroid) {
    gap = 8;
  } else if (isDevTool) {
    if (isIos) {
      gap = 5.5;
    } else {
      gap = 7.5;
    }
  } else {
    gap = 4;
    width = 88;
  }

  return {
    gap,
    width,
  };
}

function initNavigationInfo(payload?: object, callback?: (payload: INavigationBarInfo) => any): INavigationBarInfo {
  if (navigationBarInfo) return navigationBarInfo;

  const systemInfo = isWeChatMiniProgram
    ? wx.getSystemInfoSync()
    : {
        system: navigator.userAgent.toLocaleLowerCase(),
        statusBarHeight: 20,
        platform: 'web',
        screenHeight: window.screen.height,
        windowHeight: window.innerHeight,
        windowWidth: window.innerWidth,
      };

  const { system, platform, statusBarHeight: sysStatusBarHeight, screenHeight, windowHeight, windowWidth } = systemInfo;
  let isIos = !!(system.toLowerCase().search('ios') + 1);
  if (!isIos) {
    isIos = !!(system.toLowerCase().search('mac os') + 1);
  }
  const isAndroid = platform === 'android';
  const isDevTool = platform === 'devtools';

  let rect = isWeChatMiniProgram
    ? wx.getMenuButtonBoundingClientRect()
    : {
        bottom: 56,
        height: 32,
        left: 278,
        right: 365,
        top: 24,
        width: 87,
      };

  let statusBarHeight = sysStatusBarHeight;
  const { gap: initialGap, width: initialWidth } = getInitialGap({
    isIos,
    isAndroid,
    isDevTool,
  });

  // STEP: 可能会遇到获取不到的情况(开启wifi和打电话下) 可以通过延时或先临时处理
  if (!statusBarHeight) {
    statusBarHeight = screenHeight - windowHeight - 20;
  }

  if (!rect) {
    rect = {
      // 获取不到胶囊信息就自定义重置一个
      bottom: statusBarHeight + initialGap + 32,
      height: 32,
      left: windowWidth - initialWidth - 10,
      right: windowWidth - 10,
      top: statusBarHeight + initialGap,
      width: initialWidth,
    };
  }

  // STEP: 计算高度
  let navBarHeight = 0;
  let gap: number = rect.top - statusBarHeight;

  if (gap <= 0) {
    gap = initialGap;
  }

  // STEP: 开发者工具神经病top是复数

  if (!sysStatusBarHeight) {
    // 开启wifi和打电话下
    navBarHeight = 2 * gap + rect.height;
  } else {
    // NOTICE: 如果第一次进来直接获取，就会是0...
    navBarHeight = statusBarHeight + 3 * gap + rect.height;
  }

  navigationBarInfo = {
    navigationBarHeight: navBarHeight,
    capsulePosition: rect,
    statusBarHeight,
  };

  if (callback) {
    callback(navigationBarInfo);
  }

  return simpleCopyObject(navigationBarInfo);
}

export { initNavigationInfo };
