import autenticator from "@/models/autenticator";

import Post from "@/models/post";
import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";
import { validate as isUUID } from "uuid";

const router = createRouter<NextApiRequest, NextApiResponse>();

router.delete(deletehandler);
router.get(gethandler);

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
    const deleted = await Post.deletePost(id as string, userId);

    res.status(201).json({ resultado: deleted });
  } catch (e) {
    res.status(401).json({ message: "Unauthorized", cause: e });
  }
}

async function gethandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const id = req.query.id as string;

    if (!isUUID(id)) {
      return res.status(400).json({ message: "ID inválido. Deve ser um UUID" });
    }

    const post = await Post.getById(id);

    if (!post) {
      return res.status(404).json({ message: "Post não encontrado" });
    }

    return res.status(200).json(post);
  } catch (error) {
    console.error("ERRO API /posts/[id]:", error);
    return res.status(500).json({ message: "Erro interno do servidor" });
  }
}
