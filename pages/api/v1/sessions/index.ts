import autenticator from "@/models/autenticator";
import sessions from "@/models/sessions";
import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";

const router = createRouter<NextApiRequest, NextApiResponse>();

router.get(async (req, res) => {
  const token = req.cookies.token;

  // Já possui token
  if (token) {
    return res.status(200).end();
  }

  const refreshToken = req.cookies.refreshToken?.split(" ")[0];

  if (!refreshToken) {
    return res.status(403).json({
      message: "refresh token não encontrado",
    });
  }

  const sessionsResult = await sessions.getRefreshToken(refreshToken);

  if (sessionsResult.length === 0) {
    return res.status(403).json({
      message: "refresh token não encontrado",
    });
  }

  const session = sessionsResult[0];

  const dataFutura = new Date();
  dataFutura.setDate(dataFutura.getDate() + 6);

  if (new Date(session.expires_at).getTime() <= dataFutura.getTime()) {
    return res.status(403).json({
      message: "faça um novo Login",
    });
  }

  const novoToken = autenticator.createToken(session.user_id);

  res.setHeader(
    "Set-Cookie",
    `token=${novoToken}; HttpOnly; Path=/; Max-Age=900; SameSite=Lax${
      process.env.NODE_ENV === "production" ? "; Secure" : ""
    }`,
  );

  return res.status(200).end();
});

export default router.handler();
