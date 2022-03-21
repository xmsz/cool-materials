import { createStore, IStoreModels, IStoreDispatch, IStoreRootState } from 'ice';
import group from './models/group';

interface IAppStoreModels extends IStoreModels {
  group: typeof group;
}

const appModels: IAppStoreModels = {
  group,
};

const store = createStore(appModels);

export default store;

export type IRootDispatch = IStoreDispatch<typeof appModels>;
export type IRootState = IStoreRootState<typeof appModels>;
