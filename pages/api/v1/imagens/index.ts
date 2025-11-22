import autenticator from "@/models/autenticator";
import imagem from "@/models/imagem";
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

router.get(auth, getHandler);
router.delete(auth, delHandler);

export default router.handler();

async function getHandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const imagens = await imagem.getAll();

    res.status(200).json(imagens);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar imagens", cause: error });
  }
}

async function delHandler(req: NextApiRequest, res: NextApiResponse) {
  const body = req.body;
  const user = req.user;
  const post = await Post.getById(body.post_id);
  const postUserId = post.user_id;

  const removed = postUserId === user.id ? await imagem.del(body.id) : null;

  return res.status(200).json(removed);
}
