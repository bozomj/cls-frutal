import { PostType } from "@/models/post";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons/faWhatsapp";
import { faShare } from "@fortawesome/free-solid-svg-icons";
// import { faPhone } from "@fortawesome/free-solid-svg-icons/faPhone";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { JSX, useCallback, useEffect, useState } from "react";

interface ProdutosProps {
  pesquisa?: string;
}

const Produtos: React.FC<ProdutosProps> = ({ pesquisa }) => {
  const [postagem, setPostagem] = useState<JSX.Element[]>([]);

  const getPosts = useCallback(async () => {
    const items = !pesquisa ? await getAllPosts() : await getSearch(pesquisa);
    setPostagem(makeItens(items));
  }, [pesquisa]);

  useEffect(() => {
    getPosts();
  }, [getPosts]);

  return (
    <>
      <div className="h-[300] bg-cyan-50 flex items-center  overflow-x-scroll max-w-full ">
        <section className="flex flex-col gap-4 p-4 w-full">
          {...postagem}
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

function getFileName(path: string): string {
  return path?.split(/[/\\]/).pop() || "";
}

function makeItens(items: PostType[]) {
  if (items.length < 1)
    return [
      <h3 key={1} className="flex justify-center text-gray-700 font-bold">
        Nada encontrado
      </h3>,
    ];
  return items.map((item, v) => {
    return (
      <div
        key={v}
        className="bg-gray-300  p-2 rounded-2xl flex justify-center hover:bg-gray-300"
      >
        <div className="flex flex-col w-full overflow-hidden h-full gap-2 ">
          <a href={`/posts/${item.id}`} target="_blank">
            <div
              className="flex-1   block bg-contain bg-no-repeat bg-center  bg-gray-200 rounded-2xl min-h-[250px]"
              style={{
                backgroundImage: `url(/uploads/${getFileName(item.url || "")})`,
              }}
            ></div>

            <div className=" flex text-gray-900 gap-2 w-[100%] truncate overflow-hidden flex-col py-2">
              <h2 className="h-5 font-bold block">{item.title ?? ""}</h2>
              <span className="h-5 text-green-700 font-bold block">
                R$: {item.valor}
              </span>
            </div>
          </a>
          <div className=" flex items-center  py-2 justify-between">
            <a href="#" target="_blank" className="">
              <FontAwesomeIcon
                icon={faWhatsapp}
                className="text-3xl text-green-900 hover:text-green-700"
              />
            </a>
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
