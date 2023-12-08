import AsyncStorage from '@react-native-async-storage/async-storage';
import {configureStore, Middleware, MiddlewareAPI} from '@reduxjs/toolkit';
import {setupListeners} from '@reduxjs/toolkit/dist/query';
import {persistReducer, persistStore} from 'redux-persist';
import FilesystemStorage from 'redux-persist-filesystem-storage';
import thunkMiddleware from 'redux-thunk';
import {IS_ANDROID} from '../../constants/constants';
import rootReducer from '../reducers/rootReducer';

export const rtkQueryErrorLogger: Middleware = (api: MiddlewareAPI) => next => action => next(action);
export type RootState = ReturnType<typeof store.getState>;

const persistConfig = {
	key: 'root',
	storage: IS_ANDROID ? FilesystemStorage : AsyncStorage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const middleWares: any[] = [thunkMiddleware, rtkQueryErrorLogger];

const store = configureStore({
	reducer: persistedReducer,
	middleware: getDefaultMiddleware => getDefaultMiddleware({serializableCheck: false}).concat(middleWares),
});

setupListeners(store.dispatch);
export type AppDispatch = typeof store.dispatch;
export let persistor = persistStore(store);

export default store;
