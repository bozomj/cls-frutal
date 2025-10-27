import database from "@/database/database";
import carrosselImages from "@/models/carrosselImages";

beforeAll(async () => {
  await database.query("delete from carrossel_images");
});

describe("Categorias", () => {
  const url =
    "https://img.freepik.com/vetores-gratis/fundo-abstrato-azul-de-meio-tom-com-espaco-de-texto_1017-41428.jpg?semt=ais_hybrid&w=740&q=80";
  it("listar imagens do carrossel vazia", async () => {
    const result = await carrosselImages.getAll();

    expect(result).toEqual(expect.any(Array));
  });

  it("listar inserir imagem em carrossel", async () => {
    const result = await carrosselImages.save(url);

    expect(result).toEqual(expect.any(Array));
    expect(result[0].url).toEqual(url);
  });

  // it("deletar imagem do carrossel", async () => {
  //   const result = await carrosselImages.remove(url);
  //   expect(result[0].url).toEqual(url);

  //   const allImages = await carrosselImages.getAll();
  //   expect(allImages).toEqual([]);
  // });
});
