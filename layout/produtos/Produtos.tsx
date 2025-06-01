import Post, { postType } from "@/models/post";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons/faWhatsapp";
import { faPhone } from "@fortawesome/free-solid-svg-icons/faPhone";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";

interface ProdutosProps {
  titulo?: string;
}

const Produtos: React.FC<ProdutosProps> = () => {
  const [postagem, setPostagem] = useState<unknown[]>([]);

  useEffect(() => {
    getAllPosts();
  }, []);

  async function getAllPosts() {
    const all = await fetch("api/v1/posts", {
      method: "GET",
    });

    const result = await all.json();
    const r = makeItens(result);
    setPostagem(r);
    console.log(result);
  }

  function getFileName(path: string): string {
    return path?.split(/[/\\]/).pop() || "";
  }

  function makeItens(items: postType[]) {
    return items.map((item, v) => {
      return (
        <div
          key={v}
          className=" md:max-w-[250px] bg-gray-100  md:min-w-[250px] min-w-full p-2 rounded-2xl flex justify-center"
        >
          <div className="flex flex-col w-full overflow-hidden h-full gap-2 ">
            <span
              className="flex-1  block bg-contain bg-no-repeat bg-center  bg-gray-200 rounded-2xl min-h-[250px]"
              style={{
                backgroundImage: `url(/uploads/${getFileName(item.url)})`,
              }}
            ></span>

            <div className=" flex text-gray-900 gap-2 w-[100%] truncate overflow-hidden flex-col">
              <span className="h-5 block">{item.description ?? ""}</span>
              <span className="h-5 block">R$: {item.valor?.toFixed(2)}</span>
              <div className=" flex items-center gap-4">
                <a
                  href={`https://wa.me/55${item.createdAt}?text=[Classificados Frutal] - fiquei interessado em seu produto \n`}
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

  return (
    <>
      <div className="h-[300] bg-cyan-50 flex items-center  overflow-x-scroll max-w-full ">
        <section className="flex items-center gap-4 p-4">
          <div className="flex gap-2">{postagem}</div>
          <div className="h-[200px] w-[80vw] md:w-[400px] bg-cyan-800"></div>
          <div className="h-[200px] w-[80vw] md:w-[400px] bg-cyan-900"></div>
          <div className="h-[200px] w-[80vw] md:w-[400px] bg-cyan-700"></div>
          <div className="h-[200px] w-[80vw] md:w-[400px] bg-cyan-500"></div>
        </section>
      </div>
    </>
  );
};

export default Produtos;
