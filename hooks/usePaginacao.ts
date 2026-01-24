import { useMemo } from "react";

export function usePaginacao(total: number, initial: number, limit: number) {
  return {
    limite: limit,
    current: initial * limit,
    maxPage: Math.ceil(total / limit),
    totalItens: total,
  };
}
