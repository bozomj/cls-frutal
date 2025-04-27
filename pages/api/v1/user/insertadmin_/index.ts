import User from "@/models/user";
import createAdminUser from "@/seeds/createAminUser";
import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";

const router = createRouter<NextApiRequest, NextApiResponse>();

// router.get(getHandler);
router.get(postHandler);

export default router.handler();

async function postHandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const existAdmin = await User.findByEmail(
      process.env.USERMASTER_EMAIL || ""
    );

    if (existAdmin.length > 0) {
      res.status(500).json({
        message: "Usuario Administrador já está cadastrado",
      });
    }

    const user = await createAdminUser();
    res.status(201).json(user);
  } catch (e) {
    res.status(500).json({
      messsage: "Erro ao inserir usuario administrador",
      cause: e,
    });
  }
}

async function getHandler(req: NextApiRequest, res: NextApiResponse) {
  res.status(404).json({ message: "Pagina não encontrada", status: "404" });
}
