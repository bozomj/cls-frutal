import firebaseConfig from "@/firebaseConfig";
import { initializeApp } from "firebase/app";
import {
  connectStorageEmulator,
  getStorage,
  ref,
  uploadBytes,
} from "firebase/storage";
import fs from "fs";
import path from "path";

describe("teste FIREBASE", () => {
  it("upload de imagem", async () => {
    const app = initializeApp(firebaseConfig);
    const storage = getStorage(app);

    const enviarArquivo = async () => {
      const storageRef = ref(storage, "/public/img/firebase");
      const caminho = path.join("public", "img", "logo.svg");
      const file = new Blob([fs.readFileSync(caminho)], { type: "image/svg" });

      console.log(caminho);

      const snap = await uploadBytes(storageRef, file);
      console.log(snap.metadata);
    };

    connectStorageEmulator(storage, "localhost", 9199);

    await enviarArquivo();
  });
});
