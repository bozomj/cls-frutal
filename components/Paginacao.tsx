import { usePagination } from "@/contexts/PaginactionContext";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export type PaginacaoType = {
  limite: number;
  current: number;
  maxPage: number;
  totalItens: number;
};

interface PaginacaoProps {
  className?: string;
}

const Paginacao: React.FC<PaginacaoProps> = ({ className }: PaginacaoProps) => {
  const { paginacao, setPaginacao } = usePagination();

  const maxPage = Math.max(
    0,
    Math.ceil(paginacao.totalItens / paginacao.limite) - 1
  );

  return (
    <div
      id="paginacao"
      className={`flex justify-between  text-cyan-800 p-4 w-full  ${className}`}
    >
      <button
        className={`${paginacao.current != 0 ? "" : "invisible"}`}
        onClick={() => {
          if (paginacao.current > 0) {
            setPaginacao((prev) => ({
              ...prev,
              current: paginacao.current - 1,
              maxPage: maxPage,
            }));
            // update(novaPaginacao);
          }
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
            maxPage == 0 ? "invisible" : ""
          }`}
        ></span>
        <span
          className={`h-2 w-2 rounded-full bg-cyan-800 ${
            paginacao.current < maxPage ? "" : "invisible"
          } `}
        ></span>
      </div>
      <button
        className={`${paginacao.current < maxPage ? "" : "invisible"}`}
        onClick={() => {
          if (paginacao.current < maxPage) {
            setPaginacao((prev) => ({
              ...prev,
              current: paginacao.current + 1,
              maxPage: maxPage,
            }));
          }
        }}
      >
        <FontAwesomeIcon
          icon={faArrowRight}
          className="text-3xl hover:text-cyan-500 cursor-pointer"
        />
      </button>
    </div>
  );
};

export default Paginacao;
