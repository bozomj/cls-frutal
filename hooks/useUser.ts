import { imageProfileType } from "@/shared/Image_types";
import { UserDBType } from "@/shared/user_types";
import { useEffect, useState } from "react";

export function useUser() {
  const [user, setUser] = useState<UserDBType | null>(null);
  const [imagemProfile, setImagemProfile] = useState<imageProfileType[] | null>(
    null,
  );

  async function getUser() {
    const response = await fetch(`/api/v1/user`);
    const responseBody = await response.json();
    setUser(responseBody.user);

    setImagemProfile(responseBody.imagemProfile);
  }

  useEffect(() => {
    getUser();
  }, []);

  return { user, imagemProfile, setUser, setImagemProfile };
}
