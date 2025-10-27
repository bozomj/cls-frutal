import database from "@/database/database";
import carrosselImages from "@/models/carrosselImages";

beforeAll(async () => {
  await database.query("delete from carrossel_images");
});

describe("Categorias", () => {
  it("listar imagens do carrossel vazia", async () => {
    const result = await carrosselImages.getAll();

    expect(result).toEqual(expect.any(Array));
  });

  it("listar inserir imagem em carrossel", async () => {
    // const result = await carrosselImages.getAll();
    const url =
      "https://img.freepik.com/vetores-gratis/fundo-abstrato-azul-de-meio-tom-com-espaco-de-texto_1017-41428.jpg?semt=ais_hybrid&w=740&q=80";
    const result = await carrosselImages.save(url);
    console.log(result);

    expect(result).toEqual(expect.any(Array));
  });
});
