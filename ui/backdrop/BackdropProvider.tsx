import { ReactNode, useContext, useState } from "react";
import BackdropContext from "./BackdropContext";
import Backdrop from "./Backdrop";

const BackdropProvider = ({ children }: { children: ReactNode }) => {
  const [content, setContent] = useState<ReactNode | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const openContent = (content: ReactNode) => {
    setContent(content);
    setIsOpen(true);
  };

  const closeContent = () => {
    setContent(null);
    setIsOpen(false);
  };

  return (
    <BackdropContext.Provider
      value={{ openContent, closeContent, isOpen, content }}
    >
      {children}
      <Backdrop />
    </BackdropContext.Provider>
  );
};

export default BackdropProvider;
