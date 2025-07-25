import ProductCard from "@/components/ProductCard";
import { PostType } from "@/models/post";

import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useEffect } from "react";

interface ProdutosProps {
  postagens: PostType[];
  paginacao: { limite: number; current: number; maxPage: number };
  next: (n1: number) => number;
  back: (n2: number) => number;
}

const Produtos: React.FC<ProdutosProps> = ({
  postagens = [],
  paginacao = { limite: 0, current: 0, maxPage: 0 },
  next,
  back,
}) => {
  useEffect(() => {});

  return (
    <>
      <div className=" bg-cyan-50 flex flex-col items-center  overflow-x-scroll max-w-full ">
        <a id="pst" href=""></a>
        <section className="flex flex-col gap-4 p-4 w-full h-fit  ">
          {...makeItens(postagens)}
        </section>

        <div
          id="paginacao"
          className="flex justify-between  text-cyan-800 p-4 w-full"
        >
          <button
            className={`${paginacao.current != 0 ? "" : "invisible"}`}
            onClick={() => {
              if (paginacao.current > 0) back(paginacao.current - 1);
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
                paginacao.current != 0 ? "" : "invisible"
              }`}
            ></span>

            <span
              className={`h-3 w-3 rounded-full bg-cyan-600 ${
                paginacao.maxPage == 0 ? "invisible" : ""
              }`}
            ></span>
            <span
              className={`h-2 w-2 rounded-full bg-cyan-800 ${
                paginacao.current < paginacao.maxPage ? "" : "invisible"
              } `}
            ></span>
          </div>

          <button
            className={`${
              paginacao.current < paginacao.maxPage ? "" : "invisible"
            }`}
            onClick={() => {
              if (paginacao.current < paginacao.maxPage)
                next(paginacao.current + 1);
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

  function makeItens(items: PostType[]) {
    if (items.length < 1)
      return [
        <h3 key={1} className="flex justify-center text-gray-700 font-bold">
          Nada encontrado
        </h3>,
      ];
    return items.map((item, v) => <ProductCard key={`${v}`} item={item} />);
  }
};

export default Produtos;
