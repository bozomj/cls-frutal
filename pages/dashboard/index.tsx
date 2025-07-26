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

import autenticator from "@/models/autenticator";
import Produtos from "@/layout/produtos/Produtos";
import ProductCardDashboard from "@/components/ProductCardDasboard";

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

  const [paginacao, setPaginacao] = useState({
    limite: 15,
    current: 0,
    totalItens: 0,
    maxPage: 0,
  });

  const getMyPost = useCallback(
    async (page: number) => {
      const initial = page * paginacao.limite;
      const myPosts = await fetch(
        `api/v1/posts/user?q=&limit=${paginacao.limite}&initial=${initial}`,
        {
          method: "GET",
        }
      );

      const pst = await myPosts.json();
      console.log(pst);
      setPaginacao((prev) => ({
        ...prev,
        totalItens: pst.total.total,
        current: page,
        maxPage: setMaxPage(pst.total.total, prev.limite) - 1,
      }));

      setPosts(pst["posts"]);
      produtosRef.current?.focus();
    },
    [paginacao.limite, setPosts]
  );

  const setMaxPage = (total: number, limit: number) => Math.ceil(total / limit);

  function mudarPagina(n: number) {
    paginacao.current = n;
    getMyPost(n);
  }

  useEffect(() => {
    getUser(ctx);
    getMyPost(0);
  }, [ctx, getMyPost]);

  return (
    <>
      <header>
        <Header titulo="Dashboard" />
      </header>
      <main className="flex-auto overflow-y-scroll bg-gray-300 flex-col flex justify-between  items-center scroll-smooth">
        <div className="flex-1 max-h-[250px] flex w-full">
          <section
            tabIndex={0}
            className=" z-[999] group bg-cyan-950 max-w-[5rem] overflow-x-hidden   p-4 flex items-start flex-col gap-2 hover:max-w-[25rem]   transition-all duration-500 border-r-2 
        focus:max-w-[25rem]
        fixed h-full
        
        "
          >
            <ul className="flex flex-col  gap-2">
              {/* <div className="flex flex-col  gap-2"> */}
              <span className="group-focus:w-[8rem] group-focus:h-[8rem] rounded-full  w-[3rem] h-[3rem] group-hover:block   bg-white   group-hover:w-[8rem] group-hover:h-[8rem] transition-all duration-500"></span>

              <ListTile
                title={user.name ?? ""}
                icon={faUser}
                url={`/profile/${user.id}`}
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

          <section className="flex-1 p-2  pl-[5.5rem] flex flex-col gap-2 w-full scroll-smooth h-full ">
            <span data-scroll-top tabIndex={1} ref={produtosRef}></span>
            <div className="flex flex-col gap-2">
              <div className="p-4 rounded-md gap-2 bg-cyan-800  flex items-center  outline-2 outline-cyan-100">
                <FontAwesomeIcon
                  icon={faPlus}
                  className="text-3xl outline-1 p-2 rounded-md outline-cyan-100"
                />
                <span>Cadastrar Produto</span>
              </div>
            </div>
            <section className="flex flex-col ">
              <Produtos
                Card={ProductCardDashboard}
                postagens={listPost}
                paginacao={paginacao}
                next={mudarPagina}
                back={mudarPagina}
              />
            </section>
          </section>
        </div>
      </main>
    </>
  );

  async function getUser(id: string) {
    console.log(id);
    const response = await fetch(`/api/v1/user`);
    setUser(await response.json());
  }
}

//executa antes de carregar
export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => redirectNotToken(context, "/login");

export default Dashboard;

function redirectNotToken(ctx: GetServerSidePropsContext, destination: string) {
  const token = ctx.req.cookies.token || "";
  console.log(token);

  try {
    const auth = autenticator.verifyToken(token);
    console.log({ message: auth });
    return {
      props: {
        ctx: auth.id,
      },
    };
  } catch (error) {
    console.log({
      redirect: error,
    });

    return {
      redirect: {
        destination: destination,
        permanent: false,
      },
    };
  }
}
