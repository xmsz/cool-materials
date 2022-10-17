import { createStore, IStoreModels, IStoreDispatch, IStoreRootState } from 'ice';
import setting from './models/setting';

interface IAppStoreModels extends IStoreModels {
  setting: typeof setting;
}

const appModels: IAppStoreModels = {
  setting,
};

const pageStore = createStore(appModels);
export default pageStore;

export type IPageRootDispatch = IStoreDispatch<typeof appModels>;
export type IPageRootState = IStoreRootState<typeof appModels>;
