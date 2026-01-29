import { imageProfileType } from "@/shared/Image_types";
import { UserDBType } from "@/shared/user_types";
import { createContext } from "react";

export const anonymousUser: UserDetailType = {
  user: {
    id: "anonymous",
    name: "Visitante",
    url: "",
  },
  imagemProfile: [],
};

export type UserDetailType = {
  user: Partial<UserDBType> | UserDBType;
  imagemProfile: imageProfileType[];
};

type userContextType = {
  user: UserDetailType;
  setUser: (user: UserDetailType) => void;
};

const UserContext = createContext<userContextType>({
  user: anonymousUser,
  setUser: () => {},
});

export default UserContext;
