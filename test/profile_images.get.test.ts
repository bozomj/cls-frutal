import database from "@/database/database";
import imagem from "@/models/imagem";
import { storage } from "@/storage/firebase";
import {
  connectStorageEmulator,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import path from "path";
import fs from "fs";

beforeAll(async () => {
  await database.query("delete  from perfil_images");
});

describe("teste imagem profile", () => {
  //   it("salvar imagem de usuario", async () => {
  //     const userId = "a5240bf7-a135-4dfc-92eb-129edea16569";

  //     const caminho = path.join("public", "img", "logo.svg");

  //     const img = { user_id: userId, url: caminho };

  //     const result = await imagem.saveProfileImage(img);

  //     expect(result).toEqual(
  //       expect.arrayContaining([
  //         expect.objectContaining({
  //           user_id: userId,
  //           url: caminho,
  //         }),
  //       ])
  //     );
  //   });

  it("erro ao salvar imagem de usuario com id incorreto", async () => {
    const userId = "a5240bf7-a135-4dfc-92eb-129edea16568";

    const caminho = path.join("public", "img", "logo2.svg");

    const img = { user_id: userId, url: caminho };

    try {
      await imagem.saveProfileImage(img);
    } catch (error) {
      expect(error).toMatchObject({
        message: "erro ao salvar",
        cause: expect.anything(), // ou o erro específico
      });
    }
  });

  it("teste salvar imagem no firebase e no postgres", async () => {
    // let imagemRef: StorageReference;
    const userId = "a5240bf7-a135-4dfc-92eb-129edea16569";
    connectStorageEmulator(storage, "localhost", 9199);
    const enviarArquivo = async () => {
      const storageRef = ref(storage, "firebase" + Date.now() + ".png");
      const caminho = path.join("public", "img", "splash.png");
      const file = new Blob([fs.readFileSync(caminho)], { type: "image/png" });

      //   imagemRef = storageRef;

      await uploadBytes(storageRef, file);

      //   const url = storageRef.toString();
      const url = await getDownloadURL(storageRef);
      const img = { user_id: userId, url: url };

      await imagem.saveProfileImage(img);
    };

    await enviarArquivo();
  });

  it("buscar imagens de perfil do usuario por id", async () => {
    const userId = "a5240bf7-a135-4dfc-92eb-129edea16569";
    const images = await imagem.getImagesProfile(userId);
    console.log(images);
  });
});
