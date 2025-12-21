import { useContext } from "react";
import BackdropContext from "./BackdropContext";

function Backdrop() {
  const context = useContext(BackdropContext);

  if (!context || !context.isOpen) return null;

  return (
    <div
      className="fixed top-0 left-0 w-full h-full bg-black z-10"
      onClick={context.closeContent}
    >
      {context.content}
    </div>
  );
}

export default Backdrop;
