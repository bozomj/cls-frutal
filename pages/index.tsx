import Carrossel from "@/components/Carrossel";
import Header from "@/components/Header";

import ProductCard from "@/components/ProductCard";
import { usePagination } from "@/contexts/PaginactionContext";
import carrosselController from "@/controllers/carrosselController";
import postController from "@/controllers/postController";
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
  const produtosRef = useRef<HTMLInputElement>(null);

  const [postagens, setPostagens] = useState([]);
  const [imgCarrossel, setImgCarrossel] = useState([]);

  const { paginacao, setPaginacao } = usePagination();
  const { limite, current } = paginacao;

  const getPosts = useCallback(async () => {
    const initial = current * limite;

    const total = await postController.getTotal(search);
    const posts = await postController.getAll(search, initial, limite);

    setPaginacao((prev) => ({
      ...prev,
      totalItens: total.total,
    }));

    setPostagens(posts);
  }, [current, limite, search, setPaginacao]);

  useEffect(() => {
    getPosts();
    carrosselController.getImagesCarrossel().then(setImgCarrossel);
  }, [getPosts]);

  useEffect(() => produtosRef.current?.focus());

  return (
    <>
      <Header />
      <main className="flex-auto overflow-y-scroll bg-gray-300 flex-col flex justify-between gap-2 items-center scroll-smooth ">
        <section
          tabIndex={0}
          className="flex flex-col gap-2 w-full p-2 md:max-w-[40rem]"
        >
          <span data-scroll-top tabIndex={1} ref={produtosRef}></span>
          <Carrossel
            imagens={imgCarrossel}
            speed={5}
            className="rounded-2xl shadow-sm shadow-gray-400"
          />

          <Produtos Card={ProductCard} postagens={postagens} />
        </section>
        <Footer />
      </main>
    </>
  );
};

export default Home;
