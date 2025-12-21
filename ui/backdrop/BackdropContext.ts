import { createContext, ReactNode } from "react";

type BackdropContextType = {
  isOpen: boolean;
  content: ReactNode;
  openContent: (content: ReactNode) => void;
  closeContent: () => void;
};

const BackdropContext = createContext<BackdropContextType | undefined>(
  undefined
);

export default BackdropContext;
