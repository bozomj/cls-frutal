import database from "@/database/database";
import imagem from "@/models/imagem";
import Post from "@/models/post";

beforeAll(async () => {
  await database.query("delete from imagens");

  await database.query("delete from posts");
});

describe("teste da tabela post", () => {
  let post_id: string;
  const token =
    "token=" +
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZkOGI5YjNjLTg1NGYtNDU2My1iNzJjLWNkNzIxZjEyMTc4NCIsImlhdCI6MTc0ODk4ODI4OCwiZXhwIjoxNzQ4OTkxODg4fQ.K4RnzkJI5VFtLmRZeSrcHz11Hj2LZj3MxFEx-4SaQ-k";
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
        Cookie: token,
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

  it("listar todas imagens", async () => {
    await imagem.getAll();
  });
});
