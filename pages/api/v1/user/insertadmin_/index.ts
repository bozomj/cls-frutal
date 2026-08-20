import User from "@/models/user";

import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";

const router = createRouter<NextApiRequest, NextApiResponse>();

router.get(getHandler);

async function getHandler(req: NextApiRequest, res: NextApiResponse) {
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

    const user = await createAminUser();

    res
      .status(201)
      .json({ message: "usuario cadastrado com sucesso!", user: user });
  } catch (e) {
    res.status(500).json({
      messsage: "Erro ao inserir usuario administrador",
      cause: e,
    });
  }
}

async function createAminUser() {
  const user = {
    name: process.env.USERMASTER_NAME || "",
    email: process.env.USERMASTER_EMAIL || "",
    password: process.env.USERMASTER_PASSWORD || "",
    phone: "34997668902",
    is_admin: true,
  };

  try {
    const userAdmin = await User.create(user);
    return userAdmin[0];
  } catch (error) {
    return error;
  }
}

export default router.handler();
