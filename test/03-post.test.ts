import database from "@/database/database";
import Post from "@/models/post";
import User from "@/models/user";

beforeAll(async () => {
  await database.query("delete from imagens");
  await database.query("delete from posts");
  await database.query("delete from users");
});

describe("teste da tabela post", () => {
  let user: { id: string };
  let token = "";

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

    await post.json();

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

  it("exibir post do usuario logado", async () => {
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
