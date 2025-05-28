import database from "@/database/database";
import Post from "@/models/post";

beforeAll(async () => {
  await database.query("delete from posts");
});

describe("teste da tabela post", () => {
  it("inserir post com sucesso", async () => {
    const pst = {
      userId: "6d8b9b3c-854f-4563-b72c-cd721f121784",
      title: "testando um post 2",
      description: "tomate cerja com abacates",
      content: "corpo do post",
      categoria_id: "1",
      valor: 10.5,
    };

    const post = await fetch("http://localhost:3000/api/v1/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(pst),
    });

    expect(post.status).toBe(201);
  });

  it("erro ao inserir post com userId inexistente", async () => {
    const pst = {
      userId: "6d8b9b3c-854f-4563-b72c-cd721f121788",
      title: "testando um post 2",
      description: "tomate cerja com abacate",
      content: "corpo do post",
    };

    const post = await fetch("http://localhost:3000/api/v1/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(pst),
    });

    expect(post.status).toBe(500);
  });

  it("listar posts", async () => {
    const post = await Post.listAllPost();
    console.log(post);
    expect(post).toEqual(expect.any(Array));
  });
});
