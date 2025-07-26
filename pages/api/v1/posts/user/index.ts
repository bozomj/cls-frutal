import autenticator from "@/models/autenticator";
import Post from "@/models/post";
import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";

const router = createRouter<NextApiRequest, NextApiResponse>();

router.get(gethandler);

export default router.handler();

async function gethandler(req: NextApiRequest, res: NextApiResponse) {
  const search = (req.query.q as string) || "%";
  const initial = (req.query.initial as string) || "0";
  const limit = (req.query.limit as string) || "15";
  let userId: string;
  try {
    const { id } = autenticator.verifyToken(req.cookies.token || "");
    console.log("id usuario", id);

    userId = id;
  } catch (e) {
    return res
      .status(401)
      .json({ message: "Unauthorized", cause: e, user: userId! });
  }

  try {
    const total = await Post.getByUserIDTotal(userId as string, search);
    const posts = await Post.getByUserID(
      userId as string,
      search,
      initial,
      limit
    );

    return res.status(200).json({ posts, total });
  } catch (error) {
    return res.status(400).json({ message: "erro generico", cause: error });
  }
}
