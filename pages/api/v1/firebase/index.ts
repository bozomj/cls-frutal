import firebaseConfig from "@/firebaseConfig";
import { initializeApp } from "firebase/app";
import {
  connectStorageEmulator,
  getDownloadURL,
  getStorage,
  listAll,
  ref,
} from "firebase/storage";
import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";

const router = createRouter<NextApiRequest, NextApiResponse>();

router.get(getHandler);

export default router.handler();

async function getHandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const app = initializeApp(firebaseConfig);
    const storage = getStorage(app);
    connectStorageEmulator(storage, "localhost", 9199);

    const listRef = ref(storage, "/");

    const result = await listAll(listRef);
    result.items.forEach((item) => {
      getDownloadURL(item).then((p) => {
        console.log(p);
      });
    });

    res.status(200).json({ result: result.items });
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar imagens", cause: error });
  }
}
