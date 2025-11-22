import database from "@/database/database";

import { storage } from "@/storage/firebase";
import {
  connectStorageEmulator,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import path from "path";
import fs from "fs";
import profileImages from "@/models/perfil_images";
import User from "@/models/user";

beforeAll(async () => {
  await database.query("delete from perfil_images");
});
let userCreated: { id: string };
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
      await profileImages.saveProfileImage(img);
    } catch (error) {
      expect(error).toMatchObject({
        message: "erro ao salvar",
        cause: expect.anything(), // ou o erro específico
      });
    }
  });

  it("teste salvar imagem no firebase e no postgres", async () => {
    await User.create({
      name: "carlos",
      email: "carlos@hotmail.com",
      phone: "34997668902",
      password: "123456",
    });
    const user = await User.findByEmail("carlos@hotmail.com");
    const userId = user[0].id;
    userCreated = user[0];

    connectStorageEmulator(storage, "localhost", 9199);
    const enviarArquivo = async () => {
      const storageRef = ref(storage, "firebase" + Date.now() + ".png");
      const caminho = path.join("public", "img", "splash.png");
      const newblob = fs.readFileSync(caminho);

      await uploadBytes(storageRef, newblob, {
        contentType: "image/png",
      });

      const url = await getDownloadURL(storageRef);
      const img = { user_id: userId, url: url };

      await profileImages.saveProfileImage(img);
    };

    await enviarArquivo();
  });

  it("buscar imagens de perfil do usuario por id", async () => {
    const userId = userCreated.id;
    const images = await profileImages.getImagesProfile(userId);

    expect(images.length).toEqual(1);
  });
});
