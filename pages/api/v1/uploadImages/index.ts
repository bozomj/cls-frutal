import { IncomingForm } from "formidable";
import { createRouter } from "next-connect";
import { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import fs from "fs";

const router = createRouter<NextApiRequest, NextApiResponse>();

router.post(postHandler);

const uploadDir = path.join(process.cwd(), "/uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

export default router.handler();

async function postHandler(req: NextApiRequest, res: NextApiResponse) {
  const form = new IncomingForm({
    multiples: true,
    uploadDir,
    keepExtensions: true,
  });

  form.parse(req, (err, fields, files) => {
    for (const file of files.file || []) {
      console.log(file.mimetype);
    }

    if (!files || Object.keys(files).length === 0) {
      return res.status(400).json({ error: "Nenhum arquivo enviado" });
    }

    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Error no upload" });
    }

    return res.status(200).json({
      message: "upload de imagens",
      files,
    });
  });
}

export const config = {
  api: {
    bodyParser: false,
  },
};
