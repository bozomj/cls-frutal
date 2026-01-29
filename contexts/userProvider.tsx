import UserContext, { anonymousUser, UserDetailType } from "./userContext";
import { useEffect, useState } from "react";

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserDetailType>(anonymousUser);

  useEffect(() => {
    fetch(`/api/v1/user`)
      .then((res) => res.json())
      .then((user) => setUser(user.error ? anonymousUser : user));
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
