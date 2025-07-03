import { PostType } from "@/models/post";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons/faWhatsapp";
import { faPhone } from "@fortawesome/free-solid-svg-icons/faPhone";
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
        <section className="flex items-center gap-4 p-4">
          <div className="flex gap-2">{...postagem}</div>
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

  const result = await all.json();
  const r = makeItens(result);
  return r;
}

function getFileName(path: string): string {
  return path?.split(/[/\\]/).pop() || "";
}

async function getSearch(pesquisa: string) {
  const result = await fetch("/api/v1/posts?search=" + pesquisa, {
    method: "GET",
  });
  const posts = makeItens(await result.json());
  return posts;
}

function makeItens(items: PostType[]) {
  return items.map((item, v) => {
    return (
      <div
        key={v}
        className=" md:max-w-[250px] bg-gray-100  md:min-w-[250px] min-w-[220px] max-w-10/12  p-2 rounded-2xl flex justify-center"
      >
        <div className="flex flex-col w-full overflow-hidden h-full gap-2 ">
          <span
            className="flex-1  block bg-contain bg-no-repeat bg-center  bg-gray-200 rounded-2xl min-h-[250px]"
            style={{
              backgroundImage: `url(/uploads/${getFileName(item.url || "")})`,
            }}
          ></span>

          <div className=" flex text-gray-900 gap-2 w-[100%] truncate overflow-hidden flex-col">
            <span className="h-5 block">{item.title ?? ""}</span>
            <span className="h-5 block">R$: {item.valor}</span>
            <div className=" flex items-center gap-4">
              <a
                href={`https://wa.me/55/?text=[Classificados Frutal] - fiquei interessado em seu produto \n`}
                target="_blank"
              >
                <FontAwesomeIcon
                  icon={faWhatsapp}
                  className="text-3xl text-green-900"
                />
              </a>
              <a href="#">
                <FontAwesomeIcon
                  icon={faPhone}
                  className="text-1xl text-blue-500"
                />
                {` ${item.createdAt}`}
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  });
}
