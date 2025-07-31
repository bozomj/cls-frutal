import Header from "@/components/Header";
import { UserType } from "@/models/user";
import { useCallback, useEffect, useState } from "react";

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

  return (
    <>
      <Header />
      <main className="flex flex-col bg-gray-200 p-4 text-gray-800">
        <section className="flex flex-col gap-2">
          <CircleAvatar imagem="https://scontent.frao1-1.fna.fbcdn.net/v/t39.30808-1/353642707_10231434738398213_6808326087723468339_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=108&ccb=1-7&_nc_sid=e99d92&_nc_eui2=AeF3kv7bEsKIQklXC7SysQTRa2-lZ-26nMZrb6Vn7bqcxpmoERpqN0AKbP_g_-C4G_o&_nc_ohc=S0Yjge1URq8Q7kNvwFlAAu0&_nc_oc=Adn-y1le_aiRX4Pt7huw4SBzvmaMwVgNqtfOj5WA3QiOMXRqLrH6WyMfRq5z6JyOEvZLazPjOxpVX2v0cWzKyLsu&_nc_zt=24&_nc_ht=scontent.frao1-1.fna&_nc_gid=9LqhX435-223rgykA329cg&oh=00_AfR9TygS0puUsmyKYwF9ddhTtnpWWKKYgsM5aqlyr1C5Yg&oe=689110D2" />
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
