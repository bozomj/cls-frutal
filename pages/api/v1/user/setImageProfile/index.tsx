import imagem from "@/models/imagem";
import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";

const router = createRouter<NextApiRequest, NextApiResponse>();

router.post(postHandler);

export default router.handler();

async function postHandler(req: NextApiRequest, res: NextApiResponse) {
  const body = req.body;
  console.log(body);

  await imagem.saveProfileImage(body);

  res.status(200).json(body);
}
