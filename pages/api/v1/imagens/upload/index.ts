import { createRouter } from "next-connect";
import type { Request, Response } from "express";
import { NextApiRequest, NextApiResponse } from "next";

type NextReq = NextApiRequest & Request;
type NextRes = NextApiResponse & Response;

import fs from "fs";
import multer from "multer";
import { uploadFile } from "@/storage/cloudflare/r2Cliente";

const upload = multer({ dest: "/tmp" });

const router = createRouter<NextReq, NextRes>();

// ⛔ IMPORTANTE
// Adiciona o middleware MULTER antes do handler
// router.use(upload.array("file"));

// Adapter para rodar middlewares Express dentro do next-connect
function multerMiddleware(req: NextReq, res: NextRes) {
  return new Promise((resolve, reject) => {
    upload.array("file")(req, res, (err: unknown) => {
      if (err) reject(err);
      resolve(true);
    });
  });
}

router.use(async (req, res, next) => {
  try {
    await multerMiddleware(req, res);
    next();
  } catch {
    res.status(500).json({ error: "Erro no upload" });
  }
});
router.post(postHandler);
router.get(getHandler);

export default router.handler();

async function getHandler(req: NextApiRequest, res: NextApiResponse) {
  return res.status(404);
}

async function postHandler(req: NextReq, res: NextApiResponse) {
  try {
    const files = req.files; // ← várias imagens

    if (!files || files.length === 0) {
      return res.status(400).json({ error: "Nenhum arquivo enviado" });
    }

    const filesArray: Express.Multer.File[] = Array.isArray(files)
      ? files
      : Object.values(files).flat();

    const uploaded = [];

    if (files !== undefined) {
      for (const file of filesArray) {
        const [ext] = file.mimetype.split("/");
        const filenameWithExt = `${file.filename}.${ext}`;

        // envia para Cloudflare R2
        await uploadFile(file.path, filenameWithExt, file.mimetype);

        fs.unlink(file.path, (err) => {
          if (err) console.error("Erro ao remover temp");
        });
        uploaded.push(filenameWithExt); // salvar só o nome no banco
      }
    }

    return res.status(200).json({ files: uploaded });
  } catch (error) {
    console.error("Erro no upload:", error);
    return res.status(500).json({ error: "Erro ao processar upload" });
  }
}

// Necessário para o Next.js permitir form-data
export const config = {
  api: {
    bodyParser: false,
  },
};
