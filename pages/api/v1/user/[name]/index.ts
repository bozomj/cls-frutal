import User from "@/models/user";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const user = await User.findByName(req.query.name as string);

  if (user.length === 0) {
    res.status(404).json({ error: "Usuário não encontrado" });
  } else {
    res.status(200).json({ user });
  }
}
