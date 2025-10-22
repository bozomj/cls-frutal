import CircleAvatar from "@/components/CircleAvatar";
import { UserType } from "@/models/user";
import { JSX, useEffect } from "react";

import ListTile from "@/components/ListTile";
import {
  faDashboard,
  faHome,
  faPodcast,
} from "@fortawesome/free-solid-svg-icons";

interface Props {
  user: UserType;
  children: JSX.Element;
}

const LayoutPage = ({ user, children }: Props) => {
  useEffect(() => {}, []);

  return (
    <>
      <div className="flex bg-gray-100 flex-1 text-gray-800">
        <aside
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
              url="/administrator"
              onClick={() => {}}
              title="Home"
              icon={faHome}
            />

            <ListTile
              title="Dashboard"
              url="/administrator/dashboard"
              icon={faDashboard}
              onClick={() => {}}
            />
            <ListTile title="Postagens" icon={faPodcast} onClick={() => {}} />
          </ul>
        </aside>

        <main
          id="container"
          className="flex flex-col gap-1 flex-1 overflow-hidden p-1"
        >
          {children}
        </main>
      </div>
    </>
  );
};

export default LayoutPage;
