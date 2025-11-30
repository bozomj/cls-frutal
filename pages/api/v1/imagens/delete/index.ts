import { createRouter } from "next-connect";
import { NextApiRequest, NextApiResponse } from "next";

import { deleteFile } from "@/storage/cloudflare/r2Cliente";

const router = createRouter<NextApiRequest, NextApiResponse>();

router.delete(deleteHandler);

export default router.handler();

async function deleteHandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { url } = await req.body;

    await deleteFile(url);

    return res
      .status(200)
      .json({ message: "arquivo deletado com sucesso", imagem: url });
  } catch (error) {
    return res.status(500).json(error);
  }
}
