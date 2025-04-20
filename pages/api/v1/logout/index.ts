

import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Set-Cookie", "token=; HttpOnly; Path=/; Max-Age=0");
  // res.status(200).json({ message: "Logout realizado com sucesso" });
  res.writeHead(302, { Location: "/" });
  res.end();
}
