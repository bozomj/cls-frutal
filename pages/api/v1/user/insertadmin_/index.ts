import User from "@/models/user";

import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";

const router = createRouter<NextApiRequest, NextApiResponse>();

// router.get(getHandler);
router.get(postHandler);

async function createAminUser() {
  const user = {
    name: process.env.USERMASTER_NAME || "",
    email: process.env.USERMASTER_EMAIL || "",
    password: process.env.USERMASTER_PASSWORD || "",
    phone: "34997668902",
    is_admin: true,
  };

  try {
    await User.create(user);
  } catch (error) {
    return error;
  }
}

export default router.handler();

async function postHandler(req: NextApiRequest, res: NextApiResponse) {
  const { tokenUrl } = req.query;

  if (!tokenUrl || tokenUrl !== process.env.USERMASTER_TOKEN_URL) {
    return res.status(404).end();
  }
  try {
    const existAdmin = await User.findByEmail(
      process.env.USERMASTER_EMAIL || "",
    );

    if (existAdmin.length > 0) {
      return res.status(404).end();
    }

    await createAminUser();

    res.status(201).json({ message: "usuario cadastrado com sucesso!" });
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
