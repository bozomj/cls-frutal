import autenticator from "@/models/autenticator";
import Post from "@/models/post";
import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";

const router = createRouter<NextApiRequest, NextApiResponse>();

router.get(gethandler);

export default router.handler();

async function gethandler(req: NextApiRequest, res: NextApiResponse) {
  let userId: string;
  try {
    const { id } = autenticator.verifyToken(req.cookies.token || "");

    userId = id;
  } catch (e) {
    return res
      .status(401)
      .json({ message: "Unauthorized", cause: e, user: userId! });
  }

  try {
    const posts = await Post.getByUserID(userId as string);

    return res.status(200).json(posts);
  } catch (error) {
    return res.status(400).json({ message: "erro generico", cause: error });
  }
}
