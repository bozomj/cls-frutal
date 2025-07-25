import Carrossel2 from "@/components/Carrossel2";
import Header from "@/components/Header";
import Produtos from "@/layout/produtos/Produtos";

import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";

interface HomeProps {
  title?: string;
}

const Home: React.FC<HomeProps> = () => {
  const { query } = useRouter();
  const search = (query.q as string) ?? "";

  const [postagens, setPostagens] = useState([]);

  const [paginacao, setPaginacao] = useState({
    limite: 1,
    current: 0,
    totalItens: 0,
    maxPage: 0,
    setMaxPage: (n1: number, n2: number) => Math.ceil(n1 / n2) - 1,
  });

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

  const getPosts = useCallback(async () => {
    const posts = await (
      await fetch(
        `api/v1/posts?search=${search}&initial=${paginacao.current}&limit=${paginacao.limite}`
      )
    ).json();

    const total = await (
      await fetch("api/v1/poststotal?q=" + search || "")
    ).json();

    paginacao.totalItens = total.total;

    paginacao.maxPage = paginacao.setMaxPage(
      paginacao.totalItens,
      paginacao.limite
    );

    setPaginacao(paginacao);
    setPostagens(posts);
    paginacao.setMaxPage(paginacao.totalItens, paginacao.limite);
  }, [paginacao, search]);

  function mudarPagina(n: number) {
    paginacao.current = n;
    getPosts();
    return paginacao.current;
  }

  useEffect(() => {
    getPosts();
  }, [getPosts]);

  return (
    <>
      <Header />
      <main className="flex-auto overflow-y-scroll bg-gray-300 flex-col flex justify-between gap-2 items-center scroll-smooth ">
        <section className="md:max-w-[100rem] w-full">
          <Carrossel2 imagens={imgCarrossel} speed={5} />
          <Produtos
            postagens={postagens}
            paginacao={paginacao}
            next={(e) => mudarPagina(e)}
            back={(e) => mudarPagina(e)}
          />
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
