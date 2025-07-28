import autenticator from "@/models/autenticator";
import Post from "@/models/post";
import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";

const router = createRouter<NextApiRequest, NextApiResponse>();

router.get(getHandler);
router.post(postHandler);
router.put(putHandler);

export default router.handler();

async function getHandler(req: NextApiRequest, res: NextApiResponse) {
  const search = (req.query.search as string) || "";
  const initial = (req.query.initial as string) || "0";
  const limit = req.query.limit as string | null;

  try {
    const posts = await Post.search(search, initial, limit);

    res.status(200).json(posts);
  } catch (error) {
    throw { message: "Erro ao buscar postagens", cause: error };
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

async function putHandler(req: NextApiRequest, res: NextApiResponse) {
  const body = req.body;
  let user;

  try {
    user = autenticator.verifyToken(req.cookies.token || "");

    if (user.id !== body.user_id) {
      throw {
        message: "Unauthorized",
        cause: "Post não pertence ao usuario atual",
      };
    } else {
      body.user_id = user.id;
    }
  } catch (e) {
    return res.status(401).json({ message: "Unauthorized", cause: e });
  }

  try {
    const post = await Post.update(body);

    return res.status(200).json(post);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "erro ao inserir post", cause: error });
  }
}
