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
import VerticalDivider from "@/components/VerticalDivider";
import { withAuth } from "@/lib/withAuth";

function Dashboard() {
  const { user } = useUserProvider().user;
  const { params } = useQueryParams();
  const { postagens, total } = usePosts(fetcher, params);
  const paginacao = usePaginacao(total, params.initial, params.limit);
  const produtosRef = useRef<HTMLSpanElement>(null);

  return (
    <div className="overflow-hidden flex flex-col h-screen">
      <Header titulo="Dashboard" className="z-[20]" />

      <main className="flex-auto relative  overflow-hidden max-h-full text-gray-800 bg-gray-300 flex-col flex justify-between  items-center scroll-smooth md:overflow-auto">
        <div className="flex-1 flex w-full md:justify-center h-full md:h-fit md:overflow-visible overflow-y-hidden ">
          <section className="group bg-gray-50 " tabIndex={0}>
            <label
              htmlFor="menu-toggle"
              className="bg-black/50 absolute md:hidden w-0 group-has-checked:w-screen h-screen z-10 top-0 left-0"
            ></label>
            <input
              type="checkbox"
              name="menu-toggle"
              id="menu-toggle"
              className="hidden"
            />
            <label htmlFor="menu-toggle">
              <section
                tabIndex={1}
                className=" 
              [&_a]:pointer-events-none
              md:[&_a]:pointer-events-auto
            z-10
            flex flex-col items-start gap-2 
            absolute  w-[4rem] h-full  p-1 overflow-hidden
            [&_p]:hidden group-has-checked:[&_p]:block
            md:[&_p]:block
            
          bg-gray-50
            group-has-checked:[&_*]:pointer-events-auto
            group-has-checked:w-9/10 
            md:min-w-[25rem] md:static md:h-auto md:w-fit md:focus:max-w-[25rem] 
           md:border-gray-300 md:text-gray-950  
            transition-all duration-500
            "
              >
                <div className="flex flex-col w-full relative ">
                  <label
                    htmlFor="menu-toggle"
                    tabIndex={1}
                    className="self-end cursor-pointer absolute hover:text-cyan-500 invisible group-has-checked:visible md:group-has-checked:invisible"
                  >
                    <FontAwesomeIcon className="text-xl p-2" icon={faClose} />
                  </label>
                  <div
                    className=" group-has-checked:w-[8rem]  group-has-checked:h-[8rem] rounded-full  w-[3rem] h-[3rem]    bg-gray-400 transition-all duration-500
                    md:w-[8rem] md:h-[8rem] overflow-hidden border-2 border-white relative
                    "
                  >
                    {user?.url && (
                      <Image
                        src={utils.getUrlImageR2(user.url ?? null)}
                        alt=""
                        fill
                        sizes="70"
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                </div>
                <ListTile
                  title={user?.name ?? ""}
                  icon={faUser}
                  url={`/profile`}
                  onClick={() => {}}
                  className="hover:bg-gray-400/50  w-full duration-500 rounded md:hover:text-gray-950  whitespace-nowrap"
                />

                <ListTile
                  title={user?.email ?? ""}
                  icon={faEnvelope}
                  onClick={() => {}}
                  className="hover:bg-gray-400/50 w-full duration-500 rounded md:hover:text-gray-950 whitespace-nowrap"
                />

                <VerticalDivider height={2} isent={8} />
                <nav className="flex flex-col overflow-x-hidden overflow-y-scroll w-full gap-2  h-full md:min-h-fit md:overflow-y-visible relative  ">
                  <li>
                    <ListTile
                      title="Produtos"
                      icon={faClipboard}
                      onClick={() => {}}
                      url="/newpost"
                      className="hover:bg-gray-400/50 duration-500 rounded md:hover:text-gray-950 whitespace-nowrap"
                    />
                  </li>
                </nav>
              </section>
            </label>
          </section>

          <section
            className="flex-1 p-1 w-full  flex flex-col gap-2 scroll-smooth 
          md:p-2 md:max-w-[40rem]  overflow-y-scroll md:overflow-y-visible
          pl-[5rem] 
          "
          >
            <section className="flex flex-col gap-2">
              <span data-scroll-top tabIndex={1} ref={produtosRef}></span>
              <div className="flex flex-col gap-2">
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
              </div>

              <Produtos
                Card={ProductCardDashboard}
                postagens={postagens}
                className="grid-cols-1! p-1! bg-gray-300/0! shadow-accent/0!"
              />
              <Paginacao paginacao={paginacao} />
            </section>
          </section>
        </div>
      </main>
    </div>
  );
}
export default Dashboard;

export const getServerSideProps = withAuth("/login");

const fetcher = (params: QueryParams) => {
  const { initial, limit } = params;
  return httpPost.getPostCurrentUser(initial * limit, limit);
};
