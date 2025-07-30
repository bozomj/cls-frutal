import { storage } from "@/storage/firebase";
import { connectStorageEmulator, ref, uploadBytes } from "firebase/storage";
import fs from "fs";
import path from "path";

describe("teste FIREBASE", () => {
  it("upload de imagem", async () => {
    const enviarArquivo = async () => {
      const storageRef = ref(storage, "firebase" + Date.now());
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
