"use client";

import { useRef } from "react";
import { Provider } from "react-redux";
import makeStore, { AppStore } from "./";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";

const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const store = useRef<AppStore>(null);

  if (!store.current) store.current = makeStore();

  return (
    <Provider store={store.current}>
      <PersistGate loading={null} persistor={persistStore(store.current)}>
        {children}
      </PersistGate>
    </Provider>
  );
};

export default StoreProvider;
