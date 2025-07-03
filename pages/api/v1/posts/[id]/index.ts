import autenticator from "@/models/autenticator";
import imagem from "@/models/imagem";
import Post from "@/models/post";
import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";

const router = createRouter<NextApiRequest, NextApiResponse>();

router.delete(deletehandler);

export default router.handler();

async function deletehandler(req: NextApiRequest, res: NextApiResponse) {
  let userId;
  try {
    const { id } = autenticator.verifyToken(req.cookies.token || "");

    userId = id;
  } catch (e) {
    return res.status(401).json({ message: "Unauthorized", cause: e });
  }

  const { id } = req.query ?? "";

  try {
    await imagem.delByPostId(id as string);
    const deleted = await Post.deletePost(id as string, userId);

    res.status(201).json({ resultado: deleted });
  } catch (e) {
    res.status(401).json({ message: "Unauthorized", cause: e });
  }
}
