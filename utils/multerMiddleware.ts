import type { NextApiRequest, NextApiResponse } from "next";
import type { RequestHandler } from "express";

export function runMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  fn: RequestHandler
) {
  return new Promise((resolve, reject) => {
    fn(req as any, res as any, (result: unknown) => {
      if (result instanceof Error) return reject(result);
      return resolve(result);
    });
  });
}
