import { PostType } from "@/models/post";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons/faWhatsapp";
// import { faPhone } from "@fortawesome/free-solid-svg-icons/faPhone";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { JSX, useEffect, useState } from "react";

interface ProdutosProps {
  titulo?: string;
  pesquisa?: string;
}

const Produtos: React.FC<ProdutosProps> = ({ pesquisa }) => {
  const [postagem, setPostagem] = useState<JSX.Element[]>([]);

  useEffect(() => {
    if (!pesquisa) {
      getAllPosts().then((e) => setPostagem(e));
    } else {
      getSearch(pesquisa).then((e) => setPostagem(e));
    }
  }, [pesquisa]);

  return (
    <>
      <div className="h-[300] bg-cyan-50 flex items-center  overflow-x-scroll max-w-full ">
        <section className="flex flex-col gap-4 p-4 w-full">
          {...postagem}
        </section>
      </div>
    </>
  );
};

export default Produtos;

async function getAllPosts() {
  const all = await fetch("api/v1/posts", {
    method: "GET",
  });

  return makeItens(await all.json());
}

function getFileName(path: string): string {
  return path?.split(/[/\\]/).pop() || "";
}

async function getSearch(pesquisa: string) {
  const result = await fetch("/api/v1/posts?search=" + pesquisa, {
    method: "GET",
  });

  return makeItens(await result.json());
}

function makeItens(items: PostType[]) {
  return items.map((item, v) => {
    if (items.length < 1) return <h3 key={1}> Nada encontrado</h3>;

    return (
      <div
        key={v}
        className="cursor-pointer 
        
        
        bg-gray-300  
        
          p-2 rounded-2xl flex justify-center hover:bg-gray-300"
      >
        <div className="flex flex-col w-full overflow-hidden h-full gap-2 ">
          <a
            className="flex-1   block bg-contain bg-no-repeat bg-center  bg-gray-200 rounded-2xl min-h-[250px]"
            href={`/posts/${item.id}`}
            style={{
              backgroundImage: `url(/uploads/${getFileName(item.url || "")})`,
            }}
          ></a>

          <div className=" flex text-gray-900 gap-2 w-[100%] truncate overflow-hidden flex-col">
            <h2 className="h-5 font-bold block">{item.title ?? ""}</h2>
            <span className="h-5 text-green-700 block">R$: {item.valor}</span>
            <div className=" flex items-center gap-4">
              <a href="#" target="_blank">
                <FontAwesomeIcon
                  icon={faWhatsapp}
                  className="text-3xl text-green-900"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  });
}
