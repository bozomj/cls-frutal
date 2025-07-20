import imagem from "@/models/imagem";
import Post from "@/models/post";
import fs from "fs";

import path from "path";
import sharp from "sharp";

beforeAll(async () => {
  // await database.query("delete from imagens");
  // await database.query("delete from posts");
});

describe("teste da tabela post", () => {
  let post_id: string;
  const token =
    "token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjViOGVhZTI4LTY2Y2QtNDFmZS04MTJkLTYzOWNmYThjMTc4NSIsImlhdCI6MTc1Mjk2MzA5OCwiZXhwIjoxNzUzMDA2Mjk4fQ.VnYxwFpKtISmXk2IMI6QNdxPnBad1wKROuQVAR4qyes";

  it("inserir post com sucesso", async () => {
    const pst = {
      user_id: "1c94e2fd-69fc-45ff-bd5e-ab907c9c69aa",
      title: "testando um post 5",
      description: "tomate cereja com abacates",
      categoria_id: 18,
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

    post_id = (await post.json())[0].id;

    expect(post.status).toBe(201);
  });

  it("erro ao inserir post com userId inexistente", async () => {
    const pst = {
      userId: "48a47280-6272-42b8-b92d-ed0bac719de3",
      title: "testando um post 2",
      description: "tomate cerja com abacate",
      content: "corpo do post",
      categoria_id: "1",
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
    const post = await Post.listAllPost();

    expect(post).toEqual(expect.any(Array));
  });

  it("insert imagem", async () => {
    const formdata = new FormData();
    // const conteudoArquivo = Buffer.from([0x89, 0x50, 0x4e, 0x47]);
    const conteudoArquivo = path.join(
      process.cwd(),
      "public",
      "img",
      "produto_teste.jpg"
    );

    console.log(conteudoArquivo);
    const outputPath = path.join(
      "public",
      "img",
      "resize",
      "produto_teste.jpg"
    );
    reduzirImagem(conteudoArquivo, outputPath);

    const imagens = [
      new Blob([fs.readFileSync(outputPath)], { type: "image/jpeg" }),
    ];

    for (const image of imagens) {
      formdata.append("image", image);
    }
    formdata.append("postid", post_id);

    await fetch("http://localhost:3000/api/v1/uploadImages", {
      method: "POST",
      body: formdata,
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

    console.log({ resultado: result.length });
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
