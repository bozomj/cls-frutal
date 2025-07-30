import { baseRef, storage } from "@/storage/firebase";
import { getDownloadURL, listAll, ref } from "firebase/storage";
import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";

const router = createRouter<NextApiRequest, NextApiResponse>();

router.get(getHandler);

export default router.handler();

async function getHandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const result = await listAll(baseRef);

    const paths = result.items.map(async (img) => {
      const refs = ref(storage, img.fullPath);
      return await getDownloadURL(refs);
    });
    const urls = await Promise.all(paths);

    res.status(200).json({ result: urls });
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar imagens", cause: error });
  }
}
