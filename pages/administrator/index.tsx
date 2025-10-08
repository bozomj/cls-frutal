import CircleAvatar from "@/components/CircleAvatar";
import autenticator from "@/models/autenticator";
import User, { UserType } from "@/models/user";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { useEffect, useState } from "react";

interface Props {
  user: UserType;
}

async function getUsers() {
  const result = await fetch("http://localhost:3000/api/v1/users", {});
  const users = await result.json();

  return users;
}

function mountUserList(users: UserType[]) {
  console.log(users);
  return users.map((user) => (
    <div
      key={user.id}
      className="p-2 border-b bg-cyan-600 flex gap-4 items-center "
    >
      <div>{user.name}</div>
      <div>{user.email}</div>
    </div>
  ));
}

const AdministratorPage = ({ user }: Props) => {
  const [users, setUsers] = useState<UserType[]>([]);

  useEffect(() => {
    getUsers().then(setUsers);
  }, []);

  return (
    <div className="p-2">
      <div>Administrator Page</div>
      <div>{user.id}</div>
      <CircleAvatar imagem={user.url} size={8} />
      <section className="flex gap-1 flex-col">
        <h2 className="text-2xl font-bold my-4 ">Lista de usuarios</h2>
        {mountUserList(users)}
      </section>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const token = context.req.cookies.token || null;
  let user;

  if (token == null)
    return { redirect: { destination: "/login", permanent: false } };

  try {
    const auth = autenticator.verifyToken(token);
    user = (await User.findById(auth.id))[0];

    if (user.is_admin !== true) throw new Error("User is not admin");

    console.log("User:", user);
  } catch (error) {
    console.log({ error: error });
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      user: JSON.parse(JSON.stringify(user)) as UserType,
    },
  };
};

export default AdministratorPage;
