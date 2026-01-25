import database from "@/database/database";
import autenticator from "@/models/autenticator";
import Post from "@/models/post";
import User from "@/models/user";
import { PostStatus } from "@/shared/post_status";
import { PostDetailType } from "@/shared/post_types";

beforeAll(async () => {
  await database.query("delete from imagens");
  await database.query("delete from posts");
  await database.query("delete from users");
});

describe("teste da tabela post", () => {
  let user: { id: string };
  let token = "";
  let posted: PostDetailType;

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
      categoria_id: 1,
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

    expect(post.status).toBe(201);

    posted = (await post.json())[0];

    expect(posted).toEqual({
      id: posted.id,
      user_id: user!.id,
      title: pst.title,
      description: pst.description,
      categoria_id: pst.categoria_id,
      valor: pst.valor.toFixed(2),
      created_at: posted.created_at,
      updated_at: posted.updated_at,
      status: PostStatus.PENDING,
    });
  });

  it("update post com sucesso and set active", async () => {
    const pst = await fetch(`http://localhost:3000/api/v1/posts`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Cookie: token,
      },
      body: JSON.stringify({
        ...posted,
        title: "poste atualizado",
        status: PostStatus.ACTIVE,
      }),
    });

    expect(pst.status).toBe(201);

    const result = await pst.json();

    expect(result.title).toEqual("poste atualizado");
    expect(result.status).toEqual(PostStatus.ACTIVE);
  });

  it("buscar postId com sucesso", async () => {
    const post = await fetch(`http://localhost:3000/api/v1/posts/${posted.id}`);

    expect(post.status).toBe(200);

    const result = await post.json();
  });

  it("erro ao aualizar post com userId diferente", async () => {
    const user = await User.create({
      name: "manoel",
      email: "manoel@hotmail.com",
      phone: "34997668902",
      password: "123456",
    });

    const userlog = await fetch("http://localhost:3000/api/v1/login", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        email: "manoel@hotmail.com",
        password: "123456",
      }),
    });

    const userBody = await userlog.json();

    const token = "token=" + userBody.token;

    const updated = await fetch(`http://localhost:3000/api/v1/posts`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Cookie: token,
      },
      body: JSON.stringify({
        ...posted,
        title: "tentando atualizar post com userId diferente",
        status: PostStatus.ACTIVE,
      }),
    });

    expect(updated.status).toBe(403);
    const result = await updated.json();

    expect(result).toEqual({
      message: "Forbidden",
      cause: "Post não pertence ao usuario atual",
    });
  });

  it("Success ao aualizar post com userId diferente and user_admin", async () => {
    const user = await User.create({
      name: "Roberto de nobrega",
      email: "roberto@hotmail.com",
      phone: "34997668902",
      password: "123456",
      is_admin: true,
    });

    await User.update({
      id: user[0].id,
      is_admin: true,
    });

    const userlog = await fetch("http://localhost:3000/api/v1/login", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        email: "roberto@hotmail.com",
        password: "123456",
      }),
    });

    const userBody = await userlog.json();

    const token = "token=" + userBody.token;

    const updated = await fetch(`http://localhost:3000/api/v1/posts`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Cookie: token,
      },
      body: JSON.stringify({
        ...posted,
        title: "tentando atualizar post com user_admin",
        status: PostStatus.ACTIVE,
      }),
    });

    expect(updated.status).toBe(201);
    const result = await updated.json();

    expect(result).toEqual({
      categoria_id: 1,
      created_at: posted.created_at,
      description: "tomate cereja com abacates",
      id: posted.id,
      status: "active",
      title: "tentando atualizar post com user_admin",
      updated_at: result.updated_at,
      user_id: posted.user_id,
      valor: "10.50",
    });
  });

  it("erro ao inserir post com userId inexistente", async () => {
    const pst = {
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

    expect(result.length).toEqual(1);
  });
});
