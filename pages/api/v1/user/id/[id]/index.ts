import User from "@/models/user";
import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";

const router = createRouter<NextApiRequest, NextApiResponse>();
router.get(getHandler);

export default router.handler();

async function getHandler(req: NextApiRequest, res: NextApiResponse) {
  const userId = req.query.id as string;
  try {
    const user = (await User.findById(userId))[0];
    const userReturned = {
      id: user.id,
      name: user.name,
      phone: user.phone,
    };
    res.status(200).json(userReturned);
  } catch (e) {
    res.status(404).json({ error: "Usuário não encontrado" });
  }
}
