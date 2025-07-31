import Header from "@/components/Header";
import { UserType } from "@/models/user";
import { useCallback, useEffect, useRef, useState } from "react";

import CircleAvatar from "@/components/CircleAvatar";
import utils from "@/utils";
import userController from "@/controllers/userController";
import Produtos from "@/layout/produtos/Produtos";
import ProductCard from "@/components/ProductCard";
import { usePagination } from "@/contexts/PaginactionContext";
import { GetServerSideProps, GetServerSidePropsContext } from "next";

const Profile: React.FC = () => {
  const [user, setUser] = useState<UserType>();
  const [posts, setPosts] = useState([]);
  const { paginacao, setPaginacao } = usePagination();

  const produtosRef = useRef<HTMLInputElement>(null);

  const { limite, current } = paginacao;
  const initial = current * limite;
  const init = useCallback(async () => {
    setUser(await userController.getUserLogin());
    const p = await userController.getPost(initial, limite);
    setPosts(p.posts);
    setPaginacao((prev) => ({ ...prev, totalItens: p.total.total }));
  }, [initial, limite, setPaginacao]);

  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => produtosRef.current?.focus());

  return (
    <>
      <Header />

      <main className="flex flex-col bg-gray-200 p-4 text-gray-800 overflow-y-scroll scroll-smooth">
        <span data-scroll-top tabIndex={1} ref={produtosRef}></span>
        <section className="flex flex-col gap-2">
          <CircleAvatar imagem="" />
          <h1>{utils.string.capitalizar(user?.name ?? "")}</h1>
        </section>

        <section
          id="publicacoes"
          className="border-t border-gray-400 flex flex-col py-4 mt-4"
        >
          <Produtos postagens={posts} Card={ProductCard} />
        </section>
      </main>
    </>
  );
};
export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => utils.redirectNotToken(context, "/login");

export default Profile;
