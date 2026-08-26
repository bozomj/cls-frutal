import User from "@/models/user";
import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";

const router = createRouter<NextApiRequest, NextApiResponse>();
export default router.handler();

router.get(getHandler);

async function getHandler(req: NextApiRequest, res: NextApiResponse) {
  const userName = req.query.name as string;
  const user = (await User.findByName(userName))[0];

  const userReturned = {
    id: user.id,
    name: user.name,
    phone: user.phone,
  };

  if (user.length === 0) {
    res.status(404).json({ error: "Usuário não encontrado" });
  } else {
    res.status(200).json(userReturned);
  }
}
