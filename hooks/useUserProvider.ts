import UserContext from "@/contexts/userContext";
import { useContext } from "react";

export function useUserProvider() {
  return useContext(UserContext);
}
