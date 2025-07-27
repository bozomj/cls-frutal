import Carrossel2 from "@/components/Carrossel2";
import Header from "@/components/Header";

import ProductCard from "@/components/ProductCard";
import { usePagination } from "@/contexts/PaginactionContext";
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
          className="md:max-w-[100rem] w-full
        md:w-[720px]
        "
        >
          <span data-scroll-top tabIndex={1} ref={produtosRef}></span>
          <Carrossel2 imagens={imgCarrossel} speed={5} />

          <Produtos Card={ProductCard} postagens={postagens} />
        </section>

        <footer className="min-h-[10rem] min-w-full bg-cyan-950 p-4 flex flex-col">
          <span className="text-center text-cyan-700">
            CLF-Frutal Classificados &copy;
          </span>
          <div className="flex-1 flex items-center">
            <a href="https://www.assistechso.com.br" target="_blank">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="w-[150px] md:w-[200px]"
                src="https://www.assistechso.com.br/_next/image?url=%2Fimg%2Flogo.png&w=256&q=75"
                alt=""
              />
            </a>
          </div>
        </footer>
      </main>
    </>
  );
};

export default Home;
