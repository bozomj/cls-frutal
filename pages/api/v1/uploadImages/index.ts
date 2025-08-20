import { createRouter } from "next-connect";
import { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import fs from "fs";
import imagem from "@/models/imagem";

const router = createRouter<NextApiRequest, NextApiResponse>();

router.post(postHandler);
router.get(getHandler);

const uploadDir = path.join(process.cwd(), "/public/uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

export default router.handler();

async function getHandler(req: NextApiRequest, res: NextApiResponse) {
  const result = await imagem.getAll();

  res.status(200).json(result);
}

async function postHandler(req: NextApiRequest, res: NextApiResponse) {
  const images = req.body;

  console.log("Imagem salva:", images);
  for (const img of images) {
    await imagem.save(img.url, img.post_id);
  }
  return res.status(200).json({
    message: "upload de imagens SUCESSO!!",
  });
}
