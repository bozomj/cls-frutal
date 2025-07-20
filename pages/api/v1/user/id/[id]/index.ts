import User from "@/models/user";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const user = await User.findById(req.query.id as string);
    res.status(200).json(user[0]);
  } catch (e) {
    console.log(e);
    res.status(404).json({ error: "Usuário não encontrado" });
  }
}
