import CarrosselScroll from "@/components/CarrosselScroll";
import Header from "@/components/Header";
import Paginacao from "@/components/Paginacao";

import ProductCard from "@/components/ProductCard";
import { useCarrosselImages } from "@/hooks/useCarrosselImages";
import { usePaginacao } from "@/hooks/usePaginacao";
import { usePosts } from "@/hooks/usePosts";
import { QueryParams, useQueryParams } from "@/hooks/useQueryParams";

import httpPost from "@/http/post";

import Footer from "@/layout/FooterLayout";
import Produtos from "@/layout/produtos/Produtos";
import autenticator from "@/models/autenticator";
import sessions from "@/models/sessions";
import { GetServerSideProps, GetServerSidePropsContext } from "next";

import { useEffect, useRef } from "react";

const Home = ({ user_id }: { user_id: string }) => {
  const { params } = useQueryParams();
  const { initial, limit } = params;
  const { postagens, total } = usePosts(fetcher, params);

  const imgCarrossel = useCarrosselImages();
  const paginacao = usePaginacao(total, initial, limit);
  const produtosRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (postagens.length === 0) return;
    produtosRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [initial, postagens]);

  return (
    <>
      <Header titulo="Home" user_id={user_id} />
      <main className=" flex-auto overflow-y-scroll bg-gray-200 flex-col flex justify-between gap-2 items-center scroll-smooth ">
        <section
          tabIndex={0}
          className="flex outline-0 flex-col gap-2 w-full  flex-1 p-2 md:max-w-7xl"
        >
          <span data-scroll-top tabIndex={1} ref={produtosRef}></span>
          <div className="flex w-full h-40 md:h-60  justify-center shadow-sm shadow-gray-400 rounded-xl p-2 bg-gray-50 ">
            <CarrosselScroll
              items={imgCarrossel}
              time={5}
              className="aspect-[21/9]! "
            />
          </div>

          <div className="w-full  relative flex justify-center">
            <img
              alt=""
              src={"https://s0.2mdn.net/simgad/8987822436431936518"}
              className="h-full  rounded-md"
            />
          </div>
          <Produtos Card={ProductCard} postagens={postagens} />
          <Paginacao
            paginacao={paginacao}
            className="shadow-md shadow-gray-400 rounded-2xl bg-white"
          />
        </section>
        <Footer />
      </main>
    </>
  );
};

const fetcher = (params: QueryParams) => {
  const { search, initial, limit } = params;
  return httpPost.getAll(search, initial * limit, limit);
};

export default Home;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  try {
    const token = context.req.cookies.token || "";
    const result = autenticator.verifyToken(token);

    return {
      props: {
        user_id: result.id || null,
      },
    };
  } catch (error) {
    return {
      props: {
        user_id: null,
      },
    };
  }
}
