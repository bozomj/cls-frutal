import Carrossel from "@/components/Carrossel";
import Header from "@/components/Header";
import ImageSlider from "@/components/ImageSlider";

import ProductCard from "@/components/ProductCard";
import { usePagination } from "@/contexts/PaginactionContext";
import Footer from "@/layout/FooterLayout";
import Produtos from "@/layout/produtos/Produtos";

import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";

interface HomeProps {
  title?: string;
}

const Home: React.FC<HomeProps> = () => {
  const { query } = useRouter();
  const search = (query.q as string) ?? "";

  const [postagens, setPostagens] = useState([]);
  const { paginacao, setPaginacao } = usePagination();

  const produtosRef = useRef<HTMLInputElement>(null);

  const imgCarrossel = [
    {
      src: "https://img.cdndsgni.com/preview/10028403.jpg",
    },
    {
      src: "https://m.media-amazon.com/images/G/32/kindle/email/2025/03_Marco/Pagina_Recomendacoes_para_voce/1500x200_Narrow.jpg",
    },
    {
      src: "https://img.freepik.com/vetores-gratis/banner-do-linkedin-de-negocios-de-gradiente_23-2150091566.jpg",
    },
    {
      src: "https://img.cdndsgni.com/preview/13138247.jpg",
    },
  ];

  const { limite, current } = paginacao;

  const getPosts = useCallback(async () => {
    const total = await (
      await fetch("api/v1/poststotal?q=" + (search || ""))
    ).json();

    const initial = current * limite;
    const posts = await (
      await fetch(
        `api/v1/posts?search=${search}&initial=${initial}&limit=${limite}`
      )
    ).json();

    setPaginacao((prev) => ({
      ...prev,
      totalItens: total.total,
    }));

    setPostagens(posts);
  }, [current, limite, search, setPaginacao]);

  useEffect(() => {
    getPosts();
  }, [getPosts]);

  useEffect(() => produtosRef.current?.focus());

  return (
    <>
      <Header />
      <main className="flex-auto overflow-y-scroll bg-gray-300 flex-col flex justify-between gap-2 items-center scroll-smooth ">
        <section
          tabIndex={0}
          className="flex flex-col gap-2 w-full p-2
        md:max-w-[40rem]
        "
        >
          <span data-scroll-top tabIndex={1} ref={produtosRef}></span>
          <Carrossel
            imagens={imgCarrossel}
            speed={5}
            className="rounded-2xl shadow-sm shadow-gray-400"
          />
          <ImageSlider
            images={[...imgCarrossel, ...imgCarrossel, ...imgCarrossel]}
          />

          <Produtos Card={ProductCard} postagens={postagens} />
        </section>
        <Footer />
      </main>
    </>
  );
};

export default Home;
