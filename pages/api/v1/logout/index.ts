import sessions from "@/models/sessions";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const refreshToken = (req.cookies.refreshToken || "")
    .replaceAll("HttpOnly", "")
    .trim();
  console.log(">>>", refreshToken);

  await sessions.deleteRefreshToken(refreshToken);

  res.setHeader("Set-Cookie", [
    "token=; HttpOnly; Path=/; Max-Age=0",
    "refreshToken=; HttpOnly; Path=/; Max-Age=0",
  ]);

  res.writeHead(302, { Location: "/" });
  return res.end();
}
