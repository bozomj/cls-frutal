import CircleAvatar from "@/components/CircleAvatar";
import autenticator from "@/models/autenticator";
import User, { UserType } from "@/models/user";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { JSX, useEffect, useState } from "react";

import ListTile from "@/components/ListTile";
import { faDashboard, faPodcast } from "@fortawesome/free-solid-svg-icons";
import AdminDashboard from "@/privatePages/admin_dashboard";

interface Props {
  user: UserType;
}

const AdministratorPage = ({ user }: Props) => {
  const [container, setContainer] = useState<JSX.Element>(<></>);

  useEffect(() => {
    console.log("pagina recarregada");
  }, []);

  return (
    <>
      <main className="flex bg-gray-100 flex-1 text-gray-800">
        <section
          id="lista_usuarios"
          className="flex  flex-col min-w-[20rem]  bg-cyan-950 p-2 text-white gap-4"
        >
          <div className="text-center font-bold text-2xl">
            Administrator Page
          </div>
          <span className="bg-cyan-800 h-[0.1rem]"></span>

          <div className="flex gap-2 items-center ">
            <CircleAvatar imagem={user.url} size={5} />
            <div className=" text-xl">{user.name}</div>
          </div>

          <span className="bg-cyan-800 h-[0.1rem]"></span>

          <ul>
            <ListTile
              title="Dashboard"
              icon={faDashboard}
              onClick={() => {
                setContainer(AdminDashboard());
              }}
            />
            <ListTile
              title="Postagens"
              icon={faPodcast}
              onClick={() => {
                setContainer(<div>Postagens</div>);
              }}
            />
          </ul>
        </section>

        <section
          id="container"
          className="flex flex-col gap-1 flex-1 overflow-hidden p-1"
        >
          <AdminDashboard />{" "}
        </section>
      </main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const token = context.req.cookies.token || null;
  let user;

  if (token == null)
    return { redirect: { destination: "/", permanent: false } };

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
