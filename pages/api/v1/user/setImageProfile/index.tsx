import autenticator from "@/models/autenticator";
import profileImages from "@/models/perfil_images";
import { deleteFile } from "@/storage/cloudflare/r2Cliente";
import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";

const router = createRouter<NextApiRequest, NextApiResponse>();

router.post(postHandler);
router.delete(deltHandler);

export default router.handler();

async function postHandler(req: NextApiRequest, res: NextApiResponse) {
  const body = req.body;
  await profileImages.saveProfileImage(body);

  res.status(200).json(body);
}

async function deltHandler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.cookies.token;
  const user = autenticator.verifyToken(token ?? "");
  const body = req.body;

  if (body.user_id !== user.id)
    return res.status(403).json({ message: "usuario não permitido!!" });

  await profileImages.del(body.id);
  await deleteFile(body.url);

  return res.status(403).json({ message: "nao permitido" });
}
