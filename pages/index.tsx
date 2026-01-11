import CarrosselScroll from "@/components/CarrosselScroll";
import Header from "@/components/Header";
import Paginacao from "@/components/Paginacao";

import ProductCard from "@/components/ProductCard";
import httpCarrosselImage from "@/http/carrossel_image";
import httpPost from "@/http/post";

import Footer from "@/layout/FooterLayout";
import Produtos from "@/layout/produtos/Produtos";
import Post from "@/models/post";
import { PostDetailType } from "@/shared/post_types";
import { GetServerSidePropsContext } from "next";

import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

interface HomeProps {
  title?: string;
}

const Home: React.FC<HomeProps> = () => {
  const search = useRouter().query.q ?? "";

  const produtosRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // const postagens = posts;
  const [postagens, setPostagens] = useState<PostDetailType[]>([]);

  const initial = Number(router.query.initial ?? "0");
  const limit = Number(router.query.limit ?? "5");

  const [imgCarrossel, setImgCarrossel] = useState([]);

  const [paginacao, setPaginacao] = useState({
    limite: limit,
    current: initial * limit,
    maxPage: Math.ceil(0 / limit),
    totalItens: 0,
  });

  useEffect(() => {
    httpPost.getAll(search, initial, limit).then((res) => {
      setPaginacao((p) => ({
        ...p,
        current: initial * limit,
        maxPage: Math.ceil(res[0].total / limit),
        totalItens: res[0].total,
      }));
      setPostagens(res);
    });
  }, [limit, initial, search]);

  useEffect(() => {
    httpCarrosselImage.getImagesCarrossel().then(setImgCarrossel);
  }, []);

  useEffect(() => produtosRef.current?.focus());

  return (
    <>
      <Header />
      <main className="flex-auto overflow-y-scroll bg-gray-200 flex-col flex justify-between gap-2 items-center scroll-smooth ">
        <section
          tabIndex={0}
          className="flex flex-col gap-2 w-full  flex-1 p-2 md:max-w-[40rem]"
        >
          <span data-scroll-top tabIndex={1} ref={produtosRef}></span>
          <CarrosselScroll items={imgCarrossel} time={5} />
          <div className="w-full  relative flex justify-center">
            <img
              alt=""
              src={"https://s0.2mdn.net/simgad/8987822436431936518"}
              className="h-full  rounded-md"
            />
          </div>
          <Produtos Card={ProductCard} postagens={postagens} />
          <Paginacao paginacao={paginacao} />
        </section>
        <Footer />
      </main>
    </>
  );
};

export default Home;

// export async function getServerSideProps(context: GetServerSidePropsContext) {
//   const limit = Number(context.query.limit ?? 5);
//   const initial = Number(context.query.initial ?? 0) * limit;
//   const search = (context.query.q ?? "") as string;

//   const posts = await Post.search(search, initial.toString(), limit.toString());
//   const total = await Post.getTotal(search);
//   return {
//     props: {
//       posts: JSON.parse(JSON.stringify(posts)),
//       total: JSON.parse(JSON.stringify(total))[0].total,
//       initial: initial,
//     },
//   };
// }
