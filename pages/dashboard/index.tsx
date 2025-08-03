import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { useCallback, useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faCalendar,
  faEnvelope,
  faUser,
  faClipboard,
} from "@fortawesome/free-regular-svg-icons";

import { faPlus } from "@fortawesome/free-solid-svg-icons";

import Header from "@/components/Header";
import ListTile from "@/components/ListTile";

import Produtos from "@/layout/produtos/Produtos";
import ProductCardDashboard from "@/components/ProductCardDasboard";
import { usePagination } from "@/contexts/PaginactionContext";
import utils from "@/utils";

type UserType = {
  id?: string;
  name?: string;
  email?: string;
  title?: string;
  createdAt?: string;
};

function Dashboard({ ctx }: { ctx: string }) {
  const [user, setUser] = useState<UserType>({});
  const [listPost, setPosts] = useState([]);
  const produtosRef = useRef<HTMLInputElement>(null);
  const { paginacao, setPaginacao } = usePagination();
  const { limite, current } = paginacao;

  const getMyPost = useCallback(async () => {
    const initial = current * limite;
    const myPosts = await fetch(
      `api/v1/posts/user?q=&limit=${limite}&initial=${initial}`,
      {
        method: "GET",
      }
    );

    const pst = await myPosts.json();

    setPaginacao((prev) => ({
      ...prev,
      totalItens: pst.total.total,
    }));

    setPosts(pst["posts"]);
    produtosRef.current?.focus();
  }, [current, limite, setPaginacao]);

  useEffect(() => {
    getUser();
    getMyPost();
  }, [ctx, getMyPost]);

  return (
    <>
      <header>
        <Header titulo="Dashboard" />
      </header>
      <main
        className="flex-auto overflow-y-scroll text-white bg-gray-300 flex-col flex justify-between  items-center scroll-smooth
        
      "
      >
        <div className="flex-1 flex w-full">
          <section
            tabIndex={0}
            className=" z-[999] group bg-cyan-950 max-w-[5rem] overflow-x-hidden   p-4 flex items-start flex-col gap-2 hover:max-w-[25rem]   transition-all duration-500  
                border-r-10 border-cyan-950
          focus:max-w-[25rem] fixed h-full 
          md:min-w-[25rem] md:static md:h-auto
        
        "
          >
            <ul className="flex flex-col gap-2 md:fixed ">
              {/* <div className="flex flex-col  gap-2"> */}
              <span
                className="group-focus:w-[8rem] group-focus:h-[8rem] rounded-full  w-[3rem] h-[3rem] group-hover:block   bg-white   group-hover:w-[8rem] group-hover:h-[8rem] transition-all duration-500
              md:w-[8rem] md:h-[8rem] 
              "
              ></span>

              <ListTile
                title={user.name ?? ""}
                icon={faUser}
                url={`/profile`}
                onClick={() => {}}
              />
              {/* </div> */}
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
                  url="/newpost"
                />
              </li>
            </ul>
          </section>

          <section
            className="flex-1 p-2 w-full pl-[5.5rem] flex flex-col gap-2 scroll-smooth h-full 
          md:p-2 
           "
          >
            <span data-scroll-top tabIndex={1} ref={produtosRef}></span>
            <span className="flex flex-col gap-2">
              <div className="p-4 rounded-md gap-2 bg-cyan-800  flex items-center  outline-2 outline-cyan-100 ">
                <FontAwesomeIcon
                  icon={faPlus}
                  className="text-3xl outline-1 p-2 rounded-md outline-cyan-100"
                />
                <span>Cadastrar Produto</span>
              </div>
            </span>
            <section className="flex flex-col">
              <Produtos
                Card={ProductCardDashboard}
                postagens={listPost}
                className="rounded-2xl"
              />
            </section>
          </section>
        </div>
      </main>
    </>
  );

  async function getUser() {
    const response = await fetch(`/api/v1/user`);
    setUser(await response.json());
  }
}

//executa antes de carregar
export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => utils.redirectNotToken(context, "/login");

export default Dashboard;
