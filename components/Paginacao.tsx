import { usePagination } from "@/contexts/PaginactionContext";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useRouter } from "next/router";

export type PaginacaoType = {
  limite: number;
  current: number;
  maxPage: number;
  totalItens: number;
  nextPage: number;
  prevPage: number;
};

interface PaginacaoProps {
  className?: string;
}

const Paginacao: React.FC<PaginacaoProps> = ({ className }: PaginacaoProps) => {
  const { paginacao, setPaginacao } = usePagination();
  const router = useRouter();
  const urlQuerys = Object.entries(router.query).reduce<Record<string, string>>(
    (acc, [key, value]) => {
      if (typeof value === "string") acc[key] = value;
      return acc;
    },
    {}
  );

  const nextParams = new URLSearchParams(urlQuerys);
  const prevParams = new URLSearchParams(urlQuerys);

  paginacao.current = parseInt(nextParams.get("initial") ?? "0");
  paginacao.limite = parseInt(
    nextParams.get("limit") ?? paginacao.limite.toString()
  );

  nextParams.set("initial", String(paginacao.current + 1));
  prevParams.set("initial", String(paginacao.current - 1));

  const maxPage = Math.max(
    Math.ceil(paginacao.totalItens / paginacao.limite) - 1,
    0
  );
  console.log(paginacao);
  return (
    <div
      id="paginacao"
      className={`flex justify-between  text-cyan-800 p-4 w-full  ${className}`}
    >
      <Link href={`?${prevParams.toString()}`}>
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
      </Link>
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
      <Link href={`?${nextParams.toString()}`}>
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
      </Link>
    </div>
  );
};

export default Paginacao;
