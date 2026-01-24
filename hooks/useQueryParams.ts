import { useRouter } from "next/router";

export type QueryParams = {
  search: string | string[];
  limit: number;
  initial: number;
};

export function useQueryParams() {
  const router = useRouter();

  const search = router.query.q ?? "";
  const limit = Number(router.query.limit ?? 5);
  const initial = Number(router.query.initial ?? 0);
  return { params: { search, limit, initial } };
}
