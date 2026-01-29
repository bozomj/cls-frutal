import { useRef } from "react";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faEnvelope,
  faUser,
  faClipboard,
} from "@fortawesome/free-regular-svg-icons";

import { faClose, faPlus } from "@fortawesome/free-solid-svg-icons";

import Header from "@/components/Header";
import ListTile from "@/components/ListTile";

import Produtos from "@/layout/produtos/Produtos";
import ProductCardDashboard from "@/components/ProductCardDasboard";
import utils from "@/utils";
import Link from "next/link";

import Image from "next/image";

import Paginacao from "@/components/Paginacao";

import { usePosts } from "@/hooks/usePosts";
import { usePaginacao } from "@/hooks/usePaginacao";

import { QueryParams, useQueryParams } from "@/hooks/useQueryParams";

import httpPost from "@/http/post";
import { useUserProvider } from "@/hooks/useUserProvider";

function Dashboard() {
  const { user } = useUserProvider().user;
  const { params } = useQueryParams();
  const { postagens, total } = usePosts(fetcher, params);
  const paginacao = usePaginacao(total, params.initial, params.limit);
  const produtosRef = useRef<HTMLSpanElement>(null);

  return (
    <>
      <header className="z-[20]">
        <Header titulo="Dashboard" />
      </header>
      <main className="flex-auto overflow-y-scroll text-gray-800 bg-gray-300 flex-col flex justify-between  items-center scroll-smooth">
        <div className="flex-1 flex w-full md:justify-center">
          <span className="w-[4rem]"></span>

          <section
            tabIndex={0}
            className="
            group
            flex flex-col items-start gap-2 
            fixed z-[8] w-[4rem]  h-full p-1 overflow-x-hidden
            
          bg-gray-50 border-gray-50 
            border-r-4 
            focus:w-3/4 
            md:min-w-[25rem] md:static md:h-auto md:w-fit md:focus:max-w-[25rem] 
          md:bg-gray-300 md:border-gray-300 md:text-gray-950  
            transition-all duration-500
            "
          >
            <ul className="flex flex-col w-full gap-2 md:w-[24rem] md:fixed  ">
              <span
                tabIndex={1}
                className="self-end cursor-pointer hover:text-cyan-500 invisible group-focus:visible"
              >
                <FontAwesomeIcon icon={faClose} />
              </span>

              <div
                className="group-focus:w-[8rem] group-focus:h-[8rem] rounded-full  w-[3rem] h-[3rem]    bg-gray-400 transition-all duration-500
              md:w-[8rem] md:h-[8rem] overflow-hidden border-2 border-white relative
              "
              >
                {user?.url && (
                  <Image
                    src={utils.getUrlImageR2(user.url ?? null)}
                    alt=""
                    fill
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              <ListTile
                title={user?.name ?? ""}
                icon={faUser}
                url={`/profile`}
                onClick={() => {}}
                className="md:hover:bg-gray-400/50  duration-500 rounded md:hover:text-gray-950 "
              />

              <li>
                <ListTile
                  title={user?.email ?? ""}
                  icon={faEnvelope}
                  onClick={() => {}}
                  className="md:hover:bg-gray-400/50 duration-500 rounded md:hover:text-gray-950 "
                />
              </li>

              <li>
                <ListTile
                  title="Produtos"
                  icon={faClipboard}
                  onClick={() => {}}
                  url="/newpost"
                  className="md:hover:bg-gray-400/50 duration-500 rounded md:hover:text-gray-950 "
                />
              </li>
            </ul>
          </section>

          <section
            className="flex-1 p-2 w-full  flex flex-col gap-2 scroll-smooth h-full 
          md:p-2 md:max-w-[40rem]
           "
          >
            <span data-scroll-top tabIndex={1} ref={produtosRef}></span>
            <span className="flex flex-col gap-2">
              <div className="p-4 rounded-md gap-2 bg-cyan-800 text-white flex items-center  outline-2 outline-cyan-100 ">
                <Link
                  href="/newpost"
                  className="flex gap-2 items-center"
                  target="blank"
                  rel="noreferrer"
                >
                  <FontAwesomeIcon
                    icon={faPlus}
                    className="text-3xl outline-1 p-2 rounded-md outline-cyan-100"
                  />
                  <span>Cadastrar Produto</span>
                </Link>
              </div>
            </span>
            <section className="flex flex-col">
              <Produtos
                Card={ProductCardDashboard}
                postagens={postagens}
                className="grid-cols-1!"
              />
              <Paginacao paginacao={paginacao} />
            </section>
          </section>
        </div>
      </main>
    </>
  );
}
export default Dashboard;

//executa antes de carregar
export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext,
) => utils.redirectNotToken(context, "/login");

const fetcher = (params: QueryParams) => {
  const { initial, limit } = params;
  return httpPost.getPostCurrentUser(initial * limit, limit);
};
