import activation from "@/models/activation";
import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";

const router = createRouter<NextApiRequest, NextApiResponse>();

router.patch(patchHanlder);

export default router.handler();

async function patchHanlder(req: NextApiRequest, res: NextApiResponse) {
  const activationTokenId = req.query.token_id as string;

  const validActivationToken = await activation.findOneValidById(
    activationTokenId || "",
  );
  const usedActivationToken =
    await activation.markTokenAsUsed(activationTokenId);

  await activation.activateUserByUserId(validActivationToken.user_id);

  return res.status(200).json(usedActivationToken);
}
