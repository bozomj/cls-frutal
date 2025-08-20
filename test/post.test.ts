import database from "@/database/database";
import firebaseConfig from "@/firebaseConfig";
import Post from "@/models/post";
import { imagemFirebase } from "@/storage/firebase";
import { getApp, getApps, initializeApp } from "firebase/app";
import { connectStorageEmulator, getStorage } from "firebase/storage";
import fs from "fs";

import path from "path";
import sharp from "sharp";

beforeAll(async () => {
  await database.query("delete from imagens");
  await database.query("delete from posts");
});

describe("teste da tabela post", () => {
  let post_id: string;
  const token =
    "token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjdjOGY0YmNlLTg3YWItNDg0Ny1iOTg1LWU1MDcyMmExY2FiMSIsImlhdCI6MTc1NTYzOTQzNywiZXhwIjoxNzU1NjgyNjM3fQ.alUlczjWtx-O5HA5GnQrIpimLykpC0_l7YeU3mnzldw";

  it("inserir post com sucesso", async () => {
    const pst = {
      user_id: "7c8f4bce-87ab-4847-b985-e50722a1cab1",
      title: "testando um post 5",
      description: "tomate cereja com abacates",
      categoria_id: 113,
      valor: 10.5,
    };

    const post = await fetch("http://localhost:3000/api/v1/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: token,
      },
      body: JSON.stringify(pst),
    });

    const result = await post.json();
    console.log({ resultado: result });

    post_id = result.id;

    expect(post.status).toBe(201);
  });

  it("erro ao inserir post com userId inexistente", async () => {
    const pst = {
      userId: "48a47280-6272-42b8-b92d-ed0bac719de3",
      title: "testando um post 2",
      description: "tomate cerja com abacate",
      content: "corpo do post",
      categoria_id: 113,
      valor: 10.5,
    };

    const post = await fetch("http://localhost:3000/api/v1/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: token,
      },
      body: JSON.stringify(pst),
    });

    expect(post.status).toBe(500);
  });

  it("listar posts", async () => {
    const post = await Post.listAllPost("0", "10");

    expect(post).toEqual(expect.any(Array));
  });

  it("insert imagem", async () => {
    const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    const storage = getStorage(app);
    connectStorageEmulator(storage, "localhost", 9199);
    const conteudoArquivo = path.join(
      process.cwd(),
      "public",
      "img",
      "produto_teste.jpg"
    );
    const outputPath = path.join(
      "public",
      "img",
      "resize",
      "produto_teste.jpg"
    );
    // await reduzirImagem(conteudoArquivo, outputPath);

    // const buffer = fs.readFileSync(outputPath);

    const buffer = fs.readFileSync(conteudoArquivo);
    const uni8 = new Uint8Array(buffer);
    const blob = new Blob([uni8], { type: "image/jpeg" });
    const file = new File([blob], "produto_teste.jpg", { type: "image/jpeg" });

    console.log({ imagens: uni8 });
    const imgFirebase = await imagemFirebase.uploadImageFirebase([
      { file: file },
    ]);

    const imgs = imgFirebase.map((img) => {
      return {
        url: img.url,
        post_id: post_id,
      };
    });

    await fetch("http://localhost:3000/api/v1/uploadImages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(imgs),
    });
  });

  // let imagensup: { [key: string]: string }[];

  it("listar todas imagens", async () => {
    // imagensup = await imagem.getAll();
  });

  it("deletar imagem", async () => {
    // for (const img of imagensup) {
    //   const pth = img.url.replace(/\\/g, "/");
    //   try {
    //     await fs.access(pth);
    //     await fs.unlink(pth);
    //   } catch (e: unknown) {
    //     const err = e as { code: string };
    //     if (err.code !== "ENOENT") {
    //       console.log({
    //         message: "erro ao deletar imagem",
    //         cause: e,
    //       });
    //     }
    //   }
    // }
  });

  it("exibir post do usuario logado", async () => {
    const posts = await fetch("http://localhost:3000/api/v1/posts/user", {
      method: "GET",
      headers: {
        Cookie: token,
      },
    });
    const result = await posts.json();
  });
});

async function reduzirImagem(
  inputPath: string,
  outputPath: string,
  maxSizeKB = 300
) {
  let quality = 80; // Qualidade inicial
  let buffer = await sharp(inputPath).jpeg({ quality }).toBuffer();

  while (buffer.length / 1024 > maxSizeKB && quality > 10) {
    quality -= 2;
    buffer = await sharp(inputPath).webp({ quality }).toBuffer();
  }
  if (buffer.length / 1024 > maxSizeKB) {
    buffer = await sharp(inputPath)
      .resize({ width: 1280 }) // ou outro valor
      .webp({ quality: 70 })
      .toBuffer();
  }

  fs.writeFileSync(outputPath, buffer);
  console.log(`Imagem reduzida para ${(buffer.length / 1024).toFixed(1)} KB`);
}
