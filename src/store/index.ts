import { configureStore } from "@reduxjs/toolkit";
import type { Action, ThunkAction } from "@reduxjs/toolkit";
import { createStateSyncMiddleware, initMessageListener, Config } from "redux-state-sync";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";
import { FLUSH, PAUSE, PERSIST, persistReducer, PURGE, REGISTER, REHYDRATE } from "redux-persist";

import reducer from "./rootReducer";

const createNoopStorage = () => {
  return {
    getItem(_key: string) {
      return Promise.resolve(null);
    },
    setItem(_key: string, value: string) {
      return Promise.resolve(value);
    },
    removeItem(_key: string) {
      return Promise.resolve();
    },
  };
};

const storage = typeof window !== "undefined" ? createWebStorage("local") : createNoopStorage();

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["blogs", "editor", "tabs"],
};

const persistedReducer = persistReducer(persistConfig, reducer);

const ignoredActions = [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER];

// redux-state-sync
const reduxStateSyncConfig: Config = {
  channel: "redux_broadcast_channel",
  blacklist: [...ignoredActions, "editor/editorChangesSaved"],
};

const makeStore = () =>
  configureStore({
    reducer: persistedReducer,
    devTools: process.env.NODE_ENV !== "production",

    //@ts-ignore
    middleware: (gDM) => gDM({ serializableCheck: { ignoredActions } }).concat(createStateSyncMiddleware(reduxStateSyncConfig)),
  });

const store = makeStore();

initMessageListener(store);

export default store;

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
export type AppThunk<ThunkReturnType = void> = ThunkAction<ThunkReturnType, RootState, unknown, Action>;
