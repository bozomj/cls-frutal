import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface PaginacaoProps {
  className?: string;
  paginacao: { limite: number; current: number; maxPage: number };
  next: (n1: number) => void;
  back: (n2: number) => void;
}

const Paginacao: React.FC<PaginacaoProps> = ({
  className,
  paginacao = { limite: 0, current: 0, maxPage: 0 },
  next,
  back,
}: PaginacaoProps) => {
  console.log("aqui:: ", paginacao);
  return (
    <div
      id="paginacao"
      className={`flex justify-between  text-cyan-800 p-4 w-full  ${className}`}
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
  );
};

export default Paginacao;
