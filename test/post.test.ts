import database from "@/database/database";
import imagem from "@/models/imagem";
import Post from "@/models/post";
import { promises as fs } from "fs";

beforeAll(async () => {
  await database.query("delete from imagens");
  await database.query("delete from posts");
});

describe("teste da tabela post", () => {
  let post_id: string;
  const token =
    "token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlNTlkMDBmLTdjYzItNGYyNy05NGJlLTc2YzM3ODM1ZTY0NSIsImlhdCI6MTc1MTIzNzAxNiwiZXhwIjoxNzUxMjgwMjE2fQ.nF97677S_CiUZwY9_ITH9uCPABc6wXfwQwDofFl8iSs";

  it("inserir post com sucesso", async () => {
    const pst = {
      userId: "acd3af4e-14b2-4393-8c90-f2455fd5abf6",
      title: "testando um post 3",
      description: "tomate cereja com abacates",
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
    const conteudoArquivo = Buffer.from([0x89, 0x50, 0x4e, 0x47]);
    const imagens = [
      new File([conteudoArquivo], "teste.png", {
        type: "image/png",
      }),
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

  let imagensup: { [key: string]: string }[];

  it("listar todas imagens", async () => {
    imagensup = await imagem.getAll();
  });

  it("deletar imagem", async () => {
    for (const img of imagensup) {
      const pth = img.url.replace(/\\/g, "/");

      try {
        await fs.access(pth);
        await fs.unlink(pth);
      } catch (e: unknown) {
        const err = e as { code: string };
        if (err.code !== "ENOENT") {
          console.log({
            message: "erro ao deletar imagem",
            cause: e,
          });
        }
      }
    }
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
