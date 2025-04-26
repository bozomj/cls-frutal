import createAdminUser from "@/seeds/createAminUser";
import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";

const router = createRouter<NextApiRequest, NextApiResponse>();

router.get(getHandler);

export default router.handler();

async function getHandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const user = await createAdminUser();
    res.status(201).json(user);
  } catch (e) {
    res.status(500).json({
      messsage: "Erro ao inserir usuario administrador",
      cause: e,
    });
  }
}
