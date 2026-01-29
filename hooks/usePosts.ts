import { useEffect, useState } from "react";
import httpPost from "@/http/post";
import { PostDetailType } from "@/shared/post_types";

type Params = {
  search: string | string[];
  initial: number;
  limit: number;
};

type Fetcher<T> = (params: Params) => Promise<T[]>;

export function usePosts(fetcher: Fetcher<PostDetailType>, params: Params) {
  const [postagens, setPostagens] = useState<PostDetailType[]>([]);
  const [isLoad, setIsLoad] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setIsLoad(true);

    fetcher(params)
      .then((posts) => {
        setPostagens(posts);
        setTotal(posts?.[0]?.total ?? 0);
      })
      .finally(() => {
        setIsLoad(false);
      });
  }, [params.initial, params.limit, params.search]);

  return { postagens, total, isLoad };
}
