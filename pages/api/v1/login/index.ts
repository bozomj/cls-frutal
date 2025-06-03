import autenticator from "@/models/autenticator";
import User from "@/models/user";
import { NextApiRequest } from "next";
import { NextApiResponse } from "next";
import { createRouter } from "next-connect";

const router = createRouter<NextApiRequest, NextApiResponse>();

export default router.handler();
router.get(getLogin);
router.post(postHandler);

async function getLogin(req: NextApiRequest, res: NextApiResponse) {
  const token = req.cookies.token || "";

  try {
    const result = autenticator.verifyToken(token);

    res.status(200).json({ status: true, result: result });
  } catch (error) {
    res
      .status(200)
      .json({ status: false, result: "Não autorizado", cause: error });
  }
}

async function postHandler(req: NextApiRequest, res: NextApiResponse) {
  const { email, password } = req.body;

  // const cookie = req.cookies;

  try {
    const token = await User.login(email, password);

    res.setHeader(
      "Set-Cookie",
      `token=${token}; HttpOnly; Path=/; Max-Age=3600;`
    );

    res.status(200).json({ message: "Usuário logado com sucesso" });
  } catch (error) {
    console.log({
      redirect: error,
    });
    res.status(500).json({ error: "Erro ao logar usuário" });
  }
}
