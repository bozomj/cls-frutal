import CircleAvatar from "@/components/CircleAvatar";

import { JSX, useRef } from "react";

import ListTile from "@/components/ListTile";
import {
  faCarrot,
  faDashboard,
  faHome,
  faImage,
  faPodcast,
} from "@fortawesome/free-solid-svg-icons";
import utils from "@/utils";
import { UserDBType } from "@/shared/user_types";

interface Props {
  user: UserDBType;
  children: JSX.Element;
}

const LayoutPage = ({ user, children }: Props) => {
  const scrollRef = useRef<HTMLUListElement>(null);
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    isDown.current = true;
    startX.current = e.pageX - (scrollRef.current?.offsetLeft ?? 0);
    scrollLeft.current = scrollRef.current?.scrollLeft ?? 0;
    if (scrollRef.current) scrollRef.current.style.cursor = "grabbing";
  };

  const handleMouseLeave = () => {
    isDown.current = false;
    if (scrollRef.current) scrollRef.current.style.cursor = "grab";
  };

  const handleMouseUp = () => {
    isDown.current = false;
    if (scrollRef.current) scrollRef.current.style.cursor = "grab";
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDown.current || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = x - startX.current; // diferença do movimento
    scrollRef.current.scrollLeft = scrollLeft.current - walk;
  };
  console.log(user);
  return (
    <>
      <div className="flex flex-col bg-gray-100 flex-1 text-gray-800">
        <aside
          id="lista_usuarios"
          className="flex  flex-col min-w-[20rem]  bg-cyan-950 p-2 text-white gap-4"
        >
          <div className="text-center font-bold text-2xl">
            Administrator Page
          </div>
          <span className="bg-cyan-800 h-[0.1rem]"></span>
          <div className="flex gap-2 items-center ">
            <CircleAvatar
              imagem={utils.getUrlImageR2(user.url ?? null)}
              size={5}
            />
            <div className=" text-xl">{user.name}</div>
          </div>
          <span className="bg-cyan-800 h-[0.1rem]"></span>

          <ul
            ref={scrollRef}
            className="flex w-full overflow-x-auto select-none no-drag items-center"
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
          >
            <ListTile
              url="/administrator"
              onClick={() => {}}
              title="Home"
              icon={faHome}
              className="select-none no-drag"
            />

            <ListTile
              title="Dashboard"
              url="/administrator/dashboard"
              icon={faDashboard}
              onClick={() => {}}
              className="select-none no-drag"
            />
            <ListTile
              title="Carrosel"
              icon={faCarrot}
              onClick={() => {}}
              url="/administrator/carrossel"
              className="select-none no-drag"
            />
            <ListTile
              title="Postagens"
              icon={faPodcast}
              onClick={() => {}}
              url="/administrator/posts"
              className="select-none no-drag"
            />
            <ListTile
              title="Imagens"
              icon={faImage}
              url="/administrator/imagens"
              onClick={() => {}}
            />
          </ul>
        </aside>

        <main
          id="container"
          className="flex flex-col gap-1 flex-1 overflow-hidden p-1 "
        >
          {children}
        </main>
      </div>
    </>
  );
};

export default LayoutPage;
