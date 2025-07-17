import Header from "@/components/Header";
import { UserType } from "@/models/user";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

interface ProfileProps {}

const Profile: React.FC<ProfileProps> = () => {
  const id = useRouter().query.id as string;
  const [user, setUser] = useState<UserType>();

  useEffect(() => {
    if (id) getUser(id);
  }, [id]);

  return (
    <>
      <Header />
      <main>
        <p>{user?.id}</p>
        <p>{user?.name}</p>
        <p>{user?.email}</p>
        <p>{user?.createdAt}</p>
      </main>
    </>
  );

  async function getUser(id: string) {
    const user = await fetch(`/api/v1/user/id/${id}`);
    const u = await user.json();
    console.log(u);
    setUser(u);
  }
};

export default Profile;
