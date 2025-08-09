import { storage } from "@/storage/firebase";
import {
  connectStorageEmulator,
  deleteObject,
  ref,
  StorageReference,
  uploadBytes,
} from "firebase/storage";
import fs from "fs";
import path from "path";

describe("teste FIREBASE", () => {
  let imagemRef: StorageReference;

  connectStorageEmulator(storage, "localhost", 9199);

  it("upload de imagem", async () => {
    const enviarArquivo = async () => {
      const storageRef = ref(storage, "firebase" + Date.now() + ".svg");
      const caminho = path.join("public", "img", "logo.svg");
      const buffer = fs.readFileSync(caminho);
      // const file = new Blob([buffer], { type: "image/svg+xml" });

      imagemRef = storageRef;

      await uploadBytes(storageRef, buffer);
    };

    await enviarArquivo();
  });

  it("delete imagem", async () => {
    await deleteObject(imagemRef);
  });
});
