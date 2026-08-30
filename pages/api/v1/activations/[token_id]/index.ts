import activation from "@/models/activation";
import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";

const router = createRouter<NextApiRequest, NextApiResponse>();

router.patch(patchHanlder);

export default router.handler();

async function patchHanlder(req: NextApiRequest, res: NextApiResponse) {
  const activationTokenId = req.query.token_id as string;

  try {
    const validActivationToken =
      await activation.findOneValidById(activationTokenId);

    if (validActivationToken == undefined)
      throw {
        message: "Token expirado ou já utilizado",
      };

    const activatedToken = await activation.markTokenAsUsed(activationTokenId);
    const user = await activation.activateUserByUserId(
      validActivationToken.user_id,
    );

    return res.status(200).json(activatedToken);
  } catch (e) {
    return res.status(500).json(e);
  }
}
