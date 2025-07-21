import Alert from "@/components/Alert";
import { PostType } from "@/models/post";
import utils from "@/utils";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons/faWhatsapp";
import {
  faArrowLeft,
  faArrowRight,
  faShare,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useCallback, useEffect, useState } from "react";

interface ProdutosProps {
  pesquisa?: string;
}

const Produtos: React.FC<ProdutosProps> = ({ pesquisa }) => {
  const limit = 13;
  const [pagination, setPagination] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  const [maxPage, setMaxPage] = useState(0);
  const [postagem, setPostagem] = useState<PostType[]>([]);

  const [showAlert, setShowAleret] = useState(<></>);

  const getPosts = useCallback(
    async (initial: number) => {
      getTotalPosts(pesquisa ?? "");

      const items = !pesquisa
        ? await getAllPosts(initial, limit)
        : await getSearch(pesquisa, initial, limit);
      setPostagem(items);

      const pst = document.getElementById("pst");

      pst?.focus();
    },
    [pesquisa]
  );

  useEffect(() => {
    if (localStorage.getItem("oldsearch") != pesquisa) {
      setPagination(0);
      localStorage.setItem("oldsearch", pesquisa || "");
    }

    getPosts(pagination * limit);

    console.log({
      totalItems,
      pagination,
      maxPage,
    });
  }, [getPosts, pagination, pesquisa, maxPage, totalItems]);

  return (
    <>
      {showAlert}
      <div className=" bg-cyan-50 flex flex-col items-center  overflow-x-scroll max-w-full ">
        {/* <div className="text-gray-900 flex flex-col">
          <span>{totalItems}</span>

          <span>{pagination}</span>
          <span>{maxPage}</span>
        </div> */}
        <a id="pst" href=""></a>
        <section className="flex flex-col gap-4 p-4 w-full h-fit  ">
          {...makeItens(postagem)}
        </section>

        <div className="flex justify-between  text-cyan-800 p-4 w-full">
          <button
            className={`${pagination != 0 ? "" : "invisible"}`}
            onClick={() => {
              if (pagination > 0) setPagination(pagination - 1);
            }}
          >
            <FontAwesomeIcon
              icon={faArrowLeft}
              className="text-3xl hover:text-cyan-500 cursor-pointer"
            />
          </button>

          <div className="flex items-center gap-2">
            <span
              className={`h-2 w-2 rounded-full bg-cyan-800 ${
                pagination != 0 ? "" : "invisible"
              }`}
            ></span>

            <span
              className={`h-3 w-3 rounded-full bg-cyan-600 ${
                maxPage == 0 ? "invisible" : ""
              }`}
            ></span>
            <span
              className={`h-2 w-2 rounded-full bg-cyan-800 ${
                pagination < maxPage ? "" : "invisible"
              } `}
            ></span>
          </div>

          <button
            className={`${pagination < maxPage ? "" : "invisible"}`}
            onClick={() => {
              if (pagination < maxPage) setPagination(pagination + 1);
            }}
          >
            <FontAwesomeIcon
              icon={faArrowRight}
              className="text-3xl hover:text-cyan-500 cursor-pointer"
            />
          </button>
        </div>
      </div>
    </>
  );

  async function getAllPosts(
    initial: number,
    limit: number
  ): Promise<PostType[]> {
    const result = await fetch(
      `api/v1/posts?initial=${initial}&limit=${limit}`,
      {
        method: "GET",
      }
    );

    return (await result.json()) as PostType[];
  }

  async function getTotalPosts(pesquisa: string) {
    const result = await fetch("api/v1/poststotal?q=" + pesquisa || "", {
      method: "GET",
    });

    const ttal = (await result.json()).total;
    const max = Math.ceil(ttal / limit) - 1;

    setMaxPage(max);
    setTotalItems(ttal);
  }

  async function getSearch(
    pesquisa: string,
    initial: number,
    limit: number
  ): Promise<PostType[]> {
    const result = await fetch(
      "/api/v1/posts?search=" + pesquisa + `&initial=${initial}&limit=${limit}`,
      {
        method: "GET",
      }
    );

    return (await result.json()) as PostType[];
  }

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
              <div className="flex justify-center bg-gray-200 rounded-2xl overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="flex-1   bg-gray-200   min-h-[250px]"
                  src={utils.getUrlImage(item.imageurl)}
                  alt=""
                />
              </div>

              <div className=" flex text-gray-900 gap-2 w-[100%] truncate overflow-hidden flex-col py-2">
                <h2 className="h-5 font-bold block">{item.title ?? ""}</h2>
                <p className="text-sm truncate">{item.description}</p>
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
              <button
                onClick={async () => {
                  const txt = `${window.location.origin}/posts/${item.id}`;

                  // Cria textarea invisível pra seleção
                  const ta = document.createElement("textarea");
                  //precisa estar no documento
                  //  e nao pode estar oculto,
                  // pode até estar fora da tela, mas nao oculto
                  ta.value = txt;
                  document.body.appendChild(ta);

                  ta.select();

                  try {
                    document.execCommand("copy");
                    setShowAleret(
                      <Alert
                        show
                        msg={"Link Copiado com sucesso!"}
                        onClose={function (): void {
                          setShowAleret(<></>);
                        }}
                      />
                    );
                  } catch (e) {
                    console.log(e);
                  } finally {
                    document.body.removeChild(ta);
                  }
                }}
              >
                <FontAwesomeIcon
                  icon={faShare}
                  className="text-cyan-950 text-2xl hover:text-cyan-700 cursor-pointer"
                />
              </button>
            </div>
          </div>
        </div>
      );
    });
  }
};

export default Produtos;
