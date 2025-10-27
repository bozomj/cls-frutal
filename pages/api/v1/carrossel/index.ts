import carrosselImages from "@/models/carrosselImages";
import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";

const router = createRouter<NextApiRequest, NextApiResponse>();

router.get(getHandler);
router.post(postHandler);
router.delete(delHandler);

export default router.handler();

async function getHandler(req: NextApiRequest, res: NextApiResponse) {
  const result = await carrosselImages.getAll();

  res.status(200).json(result);
}

async function postHandler(req: NextApiRequest, res: NextApiResponse) {
  const imagens = req.body;
  const data = [];
  for (const image of imagens) {
    const result = await carrosselImages.save(image.url);
    data.push(result);
  }

  return res
    .status(200)
    .json({ message: "Imagens recebidas com sucesso", data });
}

async function delHandler(req: NextApiRequest, res: NextApiResponse) {
  const imagens = req.body;
  const deleted = await carrosselImages.remove(imagens.url);

  console.log("deletando....", deleted);
  return res.status(200).json({ ok: "ok" });
}
