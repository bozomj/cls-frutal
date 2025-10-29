import autenticator from "@/models/autenticator";
import Post from "@/models/post";
import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";

const auth = async (
  req: NextApiRequest,
  res: NextApiResponse,
  next: () => void
) => {
  try {
    const token = req.cookies.token || "";
    const user = autenticator.verifyToken(token);
    (req as unknown as { user: { id: string } }).user = user;
    next();
  } catch (e: unknown) {
    const error = e as { message: string };
    res.status(401).json({ message: "Unauthorized", cause: error.message });
  }
};

const router = createRouter<NextApiRequest, NextApiResponse>();

router.get(getHandler);
router.post(auth, postHandler);
router.put(auth, putHandler);

export default router.handler();

async function getHandler(req: NextApiRequest, res: NextApiResponse) {
  const search = (req.query.search as string) || "";
  const initial = (req.query.initial as string) || "0";
  const limit = req.query.limit as string | null;

  try {
    const posts = await Post.search(search, initial, limit);

    res.status(200).json(posts);
  } catch (error: unknown) {
    throw { message: "Erro ao buscar postagens", cause: error };
  }
}

async function postHandler(req: NextApiRequest, res: NextApiResponse) {
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
  try {
    const body = req.body;
    const post = await Post.getById(body.id);
    const user = (req as unknown as { user: { id: string } }).user;

    console.log(user.id, post.user_id);

    if (!post) {
      return res.status(404).json({ message: "Post não encontrado" });
    }

    if (user.id !== post.user_id) {
      return res.status(403).json({
        message: "Forbidden",
        cause: "Post não pertence ao usuario atual",
      });
    }

    const updated = await Post.update({
      ...body,
      updated_at: new Date().toISOString(),
    });
    return res.status(200).json(updated);
  } catch (e) {
    return res.status(401).json({ message: "Unauthorized", cause: e });
  }
}
