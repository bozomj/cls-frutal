import database from "@/database/database";
import imagem from "@/models/imagem";
import Post from "@/models/post";
import { randomUUID } from "crypto";

beforeAll(async () => {
  await database.query("delete from imagens");

  await database.query("delete from posts");
});

describe("teste da tabela post", () => {
  let post_id;
  it("inserir post com sucesso", async () => {
    const pst = {
      userId: "6d8b9b3c-854f-4563-b72c-cd721f121784",
      title: "testando um post 3",
      description: "tomate cerja com abacates",
      content: "corpo do post",
      categoria_id: "1",
      valor: 10.5,
    };

    const post = await fetch("http://localhost:3000/api/v1/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZkOGI5YjNjLTg1NGYtNDU2My1iNzJjLWNkNzIxZjEyMTc4NCIsImlhdCI6MTc0ODU2MjM2MiwiZXhwIjoxNzQ4NTY1OTYyfQ.HBcpNamvL0CBMYzq50sXUu5Z0HB4CX2gO9coB7THoSY`,
      },
      body: JSON.stringify(pst),
    });
    post_id = (await post.json())[0].id;
    expect(post.status).toBe(201);
  });

  it("erro ao inserir post com userId inexistente", async () => {
    const pst = {
      userId: "6d8b9b3c-854f-4563-b72c-cd721f121788",
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
        Cookie: `token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZkOGI5YjNjLTg1NGYtNDU2My1iNzJjLWNkNzIxZjEyMTc4NCIsImlhdCI6MTc0ODU2MjM2MiwiZXhwIjoxNzQ4NTY1OTYyfQ.HBcpNamvL0CBMYzq50sXUu5Z0HB4CX2gO9coB7THoSY`,
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
    const result = await imagem.save(randomUUID(), post_id!);
    console.log(result);
  });

  it("listar todas imagens", async () => {
    const result = await imagem.getAll();
    console.log("todas imagens::: ", result);
  });
});
