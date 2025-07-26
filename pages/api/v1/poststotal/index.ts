import Post from "@/models/post";
import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";

const router = createRouter<NextApiRequest, NextApiResponse>();

router.get(getHandler);

export default router.handler();

async function getHandler(req: NextApiRequest, res: NextApiResponse) {
  const search = (req.query.q as string) || "";
  try {
    const posts = (await Post.getTotal(search))[0];

    res.status(200).json(posts);
  } catch (error) {
    throw { message: "erro com a pesquisa", cause: error };
  }
}
