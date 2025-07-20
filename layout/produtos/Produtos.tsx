import { PostType } from "@/models/post";
import utils from "@/utils";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons/faWhatsapp";
import { faShare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useCallback, useEffect, useState } from "react";

interface ProdutosProps {
  pesquisa?: string;
}

const Produtos: React.FC<ProdutosProps> = ({ pesquisa }) => {
  const [postagem, setPostagem] = useState<PostType[]>([]);

  const getPosts = useCallback(async () => {
    const items = !pesquisa ? await getAllPosts() : await getSearch(pesquisa);
    setPostagem(items);
  }, [pesquisa]);

  useEffect(() => {
    getPosts();
  }, [getPosts]);

  return (
    <>
      <div className="h-[300] bg-cyan-50 flex items-center  overflow-x-scroll max-w-full ">
        <section className="flex flex-col gap-4 p-4 w-full">
          {...makeItens(postagem)}
        </section>
      </div>
    </>
  );

  async function getAllPosts(): Promise<PostType[]> {
    const result = await fetch("api/v1/posts", {
      method: "GET",
    });

    return (await result.json()) as PostType[];
  }

  async function getSearch(pesquisa: string): Promise<PostType[]> {
    const result = await fetch("/api/v1/posts?search=" + pesquisa, {
      method: "GET",
    });

    return (await result.json()) as PostType[];
  }
};

function makeItens(items: PostType[]) {
  if (items.length < 1)
    return [
      <h3 key={1} className="flex justify-center text-gray-700 font-bold">
        Nada encontrado
      </h3>,
    ];
  return items.map((item, v) => {
    // console.log(item);
    return (
      <div
        key={v}
        className="bg-gray-300  p-2 rounded-2xl flex justify-center hover:bg-gray-300 text-gray-800"
      >
        <div className="flex flex-col w-full overflow-hidden h-full gap-2 ">
          <a href={`/posts/${item.id}`} target="_blank">
            <div className="flex justify-center bg-gray-200 rounded-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="flex-1   bg-gray-200   min-h-[250px]"
                src={utils.getUrlImage(item.imageurl)}
                alt=""
              />
            </div>

            <div className=" flex text-gray-900 gap-2 w-[100%] truncate overflow-hidden flex-col py-2">
              <h2 className="h-5 font-bold block">{item.title ?? ""}</h2>
              <span className="h-5 text-green-700 font-bold block">
                R$: {item.valor}
              </span>
            </div>
          </a>
          <div className=" flex items-end  justify-between">
            <div className="flex flex-col">
              <span>{item.name}</span>
              <a href={`https://wa.me/55${item.phone}`} target="_blank">
                <FontAwesomeIcon
                  icon={faWhatsapp}
                  className="text-3xl text-green-900 hover:text-green-700"
                />
              </a>
            </div>
            <button>
              <FontAwesomeIcon
                icon={faShare}
                className="text-cyan-950 text-2xl"
              />
            </button>
          </div>
        </div>
      </div>
    );
  });
}

export default Produtos;
