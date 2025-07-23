//endpoint para listar todos os usuários

import autenticator from "@/models/autenticator";
import User from "@/models/user";

import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";

const router = createRouter<NextApiRequest, NextApiResponse>();

router.get(getHandler);
router.post(postHandler);

export default router.handler();

async function getHandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const id = (req.headers.cookie || "").split("=")[1];
    const user = autenticator.verifyToken(id);

    const users = await User.findById(user.id);

    res.status(200).json(users[0]);
    // res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar usuários", cause: error });
  }
}

async function postHandler(req: NextApiRequest, res: NextApiResponse) {
  const body = req.body;
  const name = body.name;
  const email = body.email;
  const password = body.password;
  const phone = body.phone;

  const use = { name: name, email: email, password: password, phone: phone };

  try {
    const user = await User.create(use);

    const token = autenticator.createToken(user[0].id);
    res.setHeader(
      "Set-Cookie",
      `token=${token}; HttpOnly; Path=/; Max-Age=3600;`
    );

    res.status(201).json({
      message: "Usuario criado com sucesso",
      user: user[0],
      status: 201,
      cause: "",
    });
  } catch (error: unknown) {
    const err = error as Error;

    res.status(409).json({
      status: 409,
      message: "Erro ao criar usuario",
      cause: err.message,
    });
  }
}
