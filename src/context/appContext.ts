import React, { useContext } from "react";

interface IAppContext {
  imagePreviewURL: string | undefined;
  imagePreviewOpen: boolean;
  handleImagePreview: (src: string) => void;
}

export const AppContext = React.createContext<IAppContext | null>(null);

export const useAppContext = () => useContext(AppContext)!;
