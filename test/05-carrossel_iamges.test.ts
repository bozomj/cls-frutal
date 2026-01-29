import database from "@/database/database";
import carrosselImages from "@/models/carrosselImages";
import User from "@/models/user";

beforeAll(async () => {
  await database.query("delete from carrossel_images");
});

describe("Categorias", () => {
  const url =
    "https://img.freepik.com/vetores-gratis/fundo-abstrato-azul-de-meio-tom-com-espaco-de-texto_1017-41428.jpg";

  let url2r = "";

  it("listar imagens do carrossel vazia", async () => {
    const result = await carrosselImages.getAll();

    expect(result).toEqual(expect.any(Array));
  });

  it("listar inserir imagem em carrossel", async () => {
    const fileResult = await fetch(url);
    const blob = await fileResult.blob();

    const file = new File([blob], "teste de upload imagem", {
      type: blob.type,
    });

    const form = new FormData();

    form.append("file", file);

    const results = await fetch("http://localhost:3000/api/v1/imagens/upload", {
      method: "POST",
      body: form,
    });

    const result2 = await results.json();
    const files = result2.files;

    expect(files.length).toBeGreaterThan(0);

    url2r = files[0];

    const result = await carrosselImages.save(url2r);

    expect(result).toEqual(expect.any(Array));
    expect(result[0].url).toEqual(url2r);
  });

  it("Erro ao deletar imagem carrossel no 2r com user comun", async () => {
    const user = await fetch("http://localhost:3000/api/v1/login", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        email: "teste@hotmail.com",
        password: "123456",
      }),
    });

    const userBody = await user.json();

    const result = await fetch("http://localhost:3000/api/v1/carrossel", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Cookie: "token=" + userBody.token,
      },
      body: JSON.stringify({ url: url2r }),
    });

    const resultBody = await result.json();

    expect(result.status).toBe(403);
  });

  it("deletar imagem carrossel no 2r com user admin", async () => {
    const user = await User.login("roberto@hotmail.com", "123456");

    const result = await fetch("http://localhost:3000/api/v1/carrossel", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Cookie: "token=" + user,
      },
      body: JSON.stringify({ url: url2r }),
    });

    const resultBody = await result.json();

    expect(result.status).toBe(200);
  });
});
