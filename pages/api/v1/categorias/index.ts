import Categoria from "@/models/categoria";
import categoria from "@/models/categoria";
import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";

const router = createRouter<NextApiRequest, NextApiResponse>();

router.get(getHandler);
router.post(postHandler);

export default router.handler();

async function getHandler(req: NextApiRequest, res: NextApiResponse) {
  const result = await categoria.getAll();

  res.status(200).json(result);
}

async function postHandler(req: NextApiRequest, res: NextApiResponse) {
  const categ = req.body;

  try {
    const result = await Categoria.save(categ.descricao);
    return res.status(201).json(result);
  } catch (error) {
    return res.status(405).json(error);
  }

  // const result = await categoria.save()
}
