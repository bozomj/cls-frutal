import imagem from "@/models/imagem";
import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";

const router = createRouter<NextApiRequest, NextApiResponse>();

router.get(getHandler);

export default router.handler();

async function getHandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const imagens = await imagem.getAll();

    res.status(200).json(imagens);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar imagens", cause: error });
  }
}
