import { useContext } from "react";
import BackdropContext from "./BackdropContext";

export function useBackdrop() {
  const context = useContext(BackdropContext);

  if (!context) {
    throw new Error("useBackdrop must be used within BackdropProvider");
  }

  return context;
}
