import autenticator from "@/models/autenticator";
import {
  faCalendar,
  faEnvelope,
  faUser,
  faClipboard,
} from "@fortawesome/free-regular-svg-icons";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import Header from "@/components/Header";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import ListTile from "@/components/ListTile";

function Dashboard({ ctx }: { ctx: any }) {
  const [user, setUser] = useState<any>({});

  useEffect(() => {
    getUser(ctx);
  }, []);

  return (
    <>
      <header>
        <Header titulo="Dashboard" />
      </header>
      <main className="flex-auto overflow-y-scroll bg-gray-300 flex-col flex justify-between  items-center">
        <div className="w-full h-[100vh] flex">
          <section
            tabIndex={0}
            className="  group bg-cyan-950 max-w-[5rem] overflow-x-hidden   p-4 flex items-start flex-col gap-2 hover:max-w-[25rem]   transition-all duration-500 border-r-2 
        focus:max-w-[25rem]
        fixed h-full"
          >
            <div className="flex flex-col  gap-2">
              <span className="group-focus:w-[8rem] group-focus:h-[8rem] rounded-full  w-[3rem] h-[3rem] group-hover:block   bg-white   group-hover:w-[8rem] group-hover:h-[8rem] transition-all duration-500"></span>
              <span className="flex gap-2 p-3  group-hover:flex">
                <FontAwesomeIcon icon={faUser} className="text-2xl" />

                <p className="text-white whitespace-nowrap  opacity-0 group-focus:opacity-100 transition-all duration-500 group-hover:block group-hover:opacity-100">
                  {user.name ?? ""}
                </p>
              </span>
            </div>

            <ul>
              <li>
                <ListTile
                  title={user.email ?? ""}
                  icon={faEnvelope}
                  onClick={() => {}}
                />
              </li>

              <li>
                <ListTile
                  title={user.createdAt ?? ""}
                  icon={faCalendar}
                  onClick={() => {}}
                />
              </li>
              <li>
                <ListTile
                  title="Produtos"
                  icon={faClipboard}
                  onClick={() => {}}
                />
              </li>
            </ul>
          </section>

          <section className="flex-1 p-2 h-full ml-[5rem] flex flex-col gap-2">
            <div className="h-[250px] bg-gray-400 rounded-lg overflow-hidden p-2  ">
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Numquam
              repellendus nihil pariatur cum perferendis soluta cupiditate eum
              libero quis error, perspiciatis repellat velit qui magnam
              reprehenderit nostrum, consequuntur, adipisci illum.
            </div>
            <div className="h-[250px] bg-gray-400 rounded-lg overflow-hidden  p-2 ">
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Numquam
              repellendus nihil pariatur cum perferendis soluta cupiditate eum
              libero quis error, perspiciatis repellat velit qui magnam
              reprehenderit nostrum, consequuntur, adipisci illum.
            </div>
            <div className="h-[250px] bg-gray-400 rounded-lg overflow-hidden  p-2 ">
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Numquam
              repellendus nihil pariatur cum perferendis soluta cupiditate eum
              libero quis error, perspiciatis repellat velit qui magnam
              reprehenderit nostrum, consequuntur, adipisci illum.
            </div>
            <div className="h-[250px] bg-gray-400 rounded-lg overflow-hidden  p-2 ">
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Numquam
              repellendus nihil pariatur cum perferendis soluta cupiditate eum
              libero quis error, perspiciatis repellat velit qui magnam
              reprehenderit nostrum, consequuntur, adipisci illum.
            </div>
          </section>
        </div>
      </main>
    </>
  );

  async function getUser(id: string) {
    const query = `/api/v1/user/id/${id}`;
    const response = await fetch(query);
    const data = await response.json();

    setUser(data);
  }
}

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const token = context.req.cookies.token || "";
  let auth = null;
  try {
    auth = autenticator.verifyToken(token);
  } catch (error) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: {
      ctx: auth.id,
    },
  };
};

export default Dashboard;
