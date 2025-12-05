import { createRouter } from "next-connect";
import { NextApiRequest, NextApiResponse } from "next";

import fs from "fs";
import multer from "multer";
import { uploadFile } from "@/storage/cloudflare/r2Cliente";

const upload = multer({ dest: "tmp/" });

const router = createRouter<NextApiRequest, NextApiResponse>();

// ⛔ IMPORTANTE
// Adiciona o middleware MULTER antes do handler
router.use(upload.array("file"));

router.post(postHandler);
router.get(getHandler);

export default router.handler();

async function getHandler(req: NextApiRequest, res: NextApiResponse) {
  return res.status(404);
}

async function postHandler(req: any, res: NextApiResponse) {
  try {
    const files = req.files; // ← várias imagens

    if (!files || files.length === 0) {
      return res.status(400).json({ error: "Nenhum arquivo enviado" });
    }

    const uploaded = [];

    for (const file of files) {
      const [type, ext] = file.mimetype.split("/");
      const filenameWithExt = `${file.filename}.${ext}`;

      // envia para Cloudflare R2
      await uploadFile(file.path, filenameWithExt, file.mimetype);

      fs.unlink(file.path, (err) => {
        if (err) console.error("Erro ao remover temp");
      });
      uploaded.push(filenameWithExt); // salvar só o nome no banco
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
