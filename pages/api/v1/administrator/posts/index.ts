import autenticator from "@/models/autenticator";
import Post from "@/models/post";
import User from "@/models/user";
import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";

export interface AuthenticatedRequest extends NextApiRequest {
  user: { id: string };
}

const auth = async (
  req: NextApiRequest,
  res: NextApiResponse,
  next: () => void
) => {
  try {
    const token = req.cookies.token || "";
    const user = autenticator.verifyToken(token);

    (req as AuthenticatedRequest).user = user;

    const userAuth = (await User.findById(user.id))[0];
    if (!userAuth.is_admin) throw { message: "Usuario nao é um admin" };
    console.log(userAuth);

    next();
  } catch (e: unknown) {
    const error = e as { message: string };
    res.status(401).json({ message: "Unauthorized", cause: error.message });
  }
};

const router = createRouter<NextApiRequest, NextApiResponse>();

router.get(auth, getHandler);

export default router.handler();

async function getHandler(req: NextApiRequest, res: NextApiResponse) {
  const status = (req.query.status as string) || "";
  const initial = (req.query.initial as string) || "0";
  const limit = req.query.limit as string | "10";

  try {
    const posts = await Post.getPostByStatus(initial, limit, status);
    res.status(200).json(posts);
  } catch (error: unknown) {
    throw { message: "Erro ao buscar postagens", cause: error };
  }
}
