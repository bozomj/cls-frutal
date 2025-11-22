import database from "@/database/database";
import firebaseConfig from "@/firebaseConfig";
import Post from "@/models/post";
import User from "@/models/user";
import { imagemFirebase } from "@/storage/firebase";
import { getApp, getApps, initializeApp } from "firebase/app";
import { connectStorageEmulator, getStorage } from "firebase/storage";
import fs from "fs";

import path from "path";

beforeAll(async () => {
  await database.query("delete from imagens");
  await database.query("delete from posts");
  await database.query("delete from users");
});

describe("teste da tabela post", () => {
  let post_id: string;
  let user: { id: string };
  let token =
    "token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjdjOGY0YmNlLTg3YWItNDg0Ny1iOTg1LWU1MDcyMmExY2FiMSIsImlhdCI6MTc1NzIwNzM5OCwiZXhwIjoxNzU3MjUwNTk4fQ.v9uW2uMF3gaBQACsHjjvxdXTpdQP3wYaGmXT4J7qT7M";

  it("inserir post com sucesso", async () => {
    const resultuser = await User.create({
      name: "francisco",
      email: "teste@hotmail.com",
      phone: "34997668902",
      password: "123456",
    });

    user = resultuser[0];

    const userLogado = await User.login("teste@hotmail.com", "123456");

    token = "token=" + userLogado;

    const pst = {
      user_id: user!.id,
      title: "testando um post 5",
      description: "tomate cereja com abacates",
      categoria_id: 10,
      valor: 10.5,
    };

    const post = await fetch("http://localhost:3000/api/v1/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `${token}`,
      },
      body: JSON.stringify(pst),
    });

    const result = await post.json();

    post_id = result.id;

    expect(post.status).toBe(201);
  });

  it("erro ao inserir post com userId inexistente", async () => {
    const pst = {
      userId: user.id,
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

    const buffer = fs.readFileSync(conteudoArquivo);
    const uni8 = new Uint8Array(buffer);
    const blob = new Blob([uni8], { type: "image/jpeg" });
    const file = new File([blob], "produto_teste.jpg", { type: "image/jpeg" });

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
    // const userLogado = await User.login("bozomj@gmail.com", "123456");

    const posts = await fetch("http://localhost:3000/api/v1/posts/user", {
      method: "GET",
      headers: {
        Cookie: token,
      },
    });
    const result = await posts.json();
    expect(result.posts.length).toEqual(1);
  });
});
