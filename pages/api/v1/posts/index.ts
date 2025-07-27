import autenticator from "@/models/autenticator";
import Post from "@/models/post";
import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";

const router = createRouter<NextApiRequest, NextApiResponse>();

router.get(getHandler);
router.post(postHandler);

export default router.handler();

async function getHandler(req: NextApiRequest, res: NextApiResponse) {
  const search = req.query.search as string;
  const initial = (req.query.initial as string) || "0";
  const limit = (req.query.limit as string) || "0";

  console.log({ search: search, initial });
  if (search) {
    try {
      const posts = await Post.search(search || "", initial, limit);
      console.log(posts);
      res.status(200).json(posts);
    } catch (error) {
      throw { message: "erro com a pesquisa", cause: error };
    }
  }

  try {
    const posts = await Post.listAllPost(initial, limit);
    console.log(posts);
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar postagens", cause: error });
  }
}

async function postHandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    autenticator.verifyToken(req.cookies.token || "");
  } catch (e) {
    return res.status(401).json({ message: "Unauthorized", cause: e });
  }

  const body = req.body;
  try {
    const post = await Post.create(body);

    return res.status(201).json(post);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "erro ao inserir post", cause: error });
  }
}
