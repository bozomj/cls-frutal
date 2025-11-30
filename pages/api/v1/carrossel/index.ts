import autenticator from "@/models/autenticator";
import carrosselImages from "@/models/carrosselImages";
import User from "@/models/user";
import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";

const router = createRouter<NextApiRequest, NextApiResponse>();

router.get(getHandler);
router.post(postHandler);
router.delete(delHandler);

export default router.handler();

async function getHandler(req: NextApiRequest, res: NextApiResponse) {
  const result = await carrosselImages.getAll();

  res.status(200).json(result);
}

async function postHandler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.cookies.token || "";
  // const token = randomUUID();
  let verified;
  try {
    verified = autenticator.verifyToken(token);
    const user_id = verified.id;

    const user = await User.findById(user_id);

    if (!user[0].is_admin) throw { message: "Usuario não autorizado" };
  } catch (error: unknown) {
    const err = error as { message: string };
    return res.status(403).json({ message: err.message });
  }

  const imagens = req.body;

  const data = [];
  for (const image of imagens.files) {
    const result = await carrosselImages.save(image);
    data.push(result);
  }

  return res
    .status(200)
    .json({ message: "Imagens recebidas com sucesso", data });
}

async function delHandler(req: NextApiRequest, res: NextApiResponse) {
  const imagens = req.body;
  const deleted = await carrosselImages.remove(imagens.url);

  console.log("deletando....", deleted);
  return res.status(200).json({ ok: "ok" });
}
