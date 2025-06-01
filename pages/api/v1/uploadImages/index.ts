import { IncomingForm } from "formidable";
import { createRouter } from "next-connect";
import { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import fs from "fs";
import imagem from "@/models/imagem";

const router = createRouter<NextApiRequest, NextApiResponse>();

router.post(postHandler);
router.get(getHandler);

const uploadDir = path.join(process.cwd(), "/public/uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

export default router.handler();

async function getHandler(req: NextApiRequest, res: NextApiResponse) {
  const result = await imagem.getAll();

  res.status(200).json(result);
}

async function postHandler(req: NextApiRequest, res: NextApiResponse) {
  const form = new IncomingForm({
    multiples: true,
    uploadDir,
    keepExtensions: true,
  });

  form.parse(req, async (err, fields, files) => {
    for (const file of files.file || []) {
      console.log(file.mimetype);
    }

    const postid = fields.postid;
    console.log("arquivo>>>>> ", fields);

    if (!files || Object.keys(files).length === 0) {
      return res.status(400).json({ error: "Nenhum arquivo enviado" });
    }

    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Error no upload" });
    }

    if (files.image) {
      const imagensbanco = [];
      for (const file of files.image) {
        try {
          const n1 = (
            await imagem.save(file.filepath || "", postid![0] || "")
          )[0];

          imagensbanco.push(n1);
        } catch (error) {
          for (const img of imagensbanco) {
            await imagem.del(img.id);
          }
          return res.status(500).json({
            message: "erro ao salvar imagem no banco",
            cause: error,
          });
        }
      }
    }

    return res.status(200).json({
      message: "upload de imagens SUCESSO!!",
      files,
    });
  });
}

export const config = {
  api: {
    bodyParser: false,
  },
};
