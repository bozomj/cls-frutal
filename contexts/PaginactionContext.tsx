import { useRouter } from "next/router";
import { createContext, useContext, useState, ReactNode } from "react";

type Paginacao = {
  current: number;
  limite: number;
  totalItens: number;
  maxPage: number;
};

type PaginationContextType = {
  paginacao: Paginacao;
  setPaginacao: React.Dispatch<React.SetStateAction<Paginacao>>;
  resetPagination: () => void;
};

const PaginationContext = createContext<PaginationContextType | undefined>(
  undefined
);

export const PaginationProvider = ({ children }: { children: ReactNode }) => {
  const [paginacao, setPaginacao] = useState<Paginacao>({
    current: 0,
    limite: 5,
    totalItens: 0,
    maxPage: 0,
  });

  const resetPagination = () =>
    setPaginacao((p) => ({
      ...p,
      current: 0,
    }));

  return (
    <PaginationContext.Provider
      value={{ paginacao, setPaginacao, resetPagination }}
    >
      {children}
    </PaginationContext.Provider>
  );
};

export const usePagination = () => {
  const context = useContext(PaginationContext);
  if (!context)
    throw new Error(
      "usePagination deve ser usado dentro de PaginationProvider"
    );
  return context;
};
