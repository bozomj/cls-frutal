import carrosselImages from "@/models/carrosselImages";
import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";

const router = createRouter<NextApiRequest, NextApiResponse>();

router.get(getHandler);

export default router.handler();

async function getHandler(req: NextApiRequest, res: NextApiResponse) {
  const result = await carrosselImages.getAll();

  res.status(200).json(result);
}
