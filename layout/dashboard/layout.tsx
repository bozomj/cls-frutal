import CircleAvatar from "@/components/CircleAvatar";

import { JSX, useRef } from "react";

import ListTile from "@/components/ListTile";
import {
  faCarrot,
  faDashboard,
  faHome,
  faImage,
  faPodcast,
  faSection,
} from "@fortawesome/free-solid-svg-icons";
import utils from "@/utils";
import { UserDBType } from "@/shared/user_types";
import VerticalDivider from "@/components/VerticalDivider";
import Row from "@/components/ui/row";
import HorizontalDivider from "@/components/HorizontalDivider";

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

  return (
    <>
      <div className="flex flex-col  flex-1 text-gray-800">
        <header
          id="lista_usuarios"
          className="bg-white  z-10 shadow-sm shadow-gray-400 "
        >
          <Row className="items-end p-2">
            <CircleAvatar
              imagem={utils.getUrlImageR2(user.url ?? null)}
              size={5}
            />
            <p className=" text-xl">{user.name}</p>
            <h1 className="text-center font-bold text-2xl">
              Administrator Page
            </h1>
          </Row>
          <VerticalDivider height={1} />
          <nav
            ref={scrollRef}
            className="flex w-full overflow-x-auto select-none no-drag items-center [&>*]:hover:bg-gray-100"
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
          >
            <ListTile
              url="/"
              onClick={() => {}}
              title="Home"
              icon={faHome}
              className="select-none no-drag "
            />

            <ListTile
              url="/administrator"
              onClick={() => {}}
              title="Admin"
              icon={faSection}
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
          </nav>
        </header>
        <main
          id="container"
          className="flex p-2 flex-col gap-1 flex-1 overflow-hidden  bg-gray-100 "
        >
          {children}
        </main>
      </div>
    </>
  );
};

export default LayoutPage;
