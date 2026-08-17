import database from "@/database/database";
import categoria from "@/models/categoria";
import insertCategorias from "@/seeds/insertCategorias";
import orchestrator from "./orchestrator";

beforeAll(async () => {
  await orchestrator.cleanDatabase();
  await orchestrator.runPendingMigrations();
});

describe("Categorias", () => {
  it("inserir uma categoria aleatoria", async () => {
    await insertCategorias();
  });

  it("mostrar todas categorias", async () => {
    const categorias = await categoria.getAll();

    expect(categorias).toEqual(expect.any(Array));
  });

  it("listar categorias via api", async () => {
    const categorias = await (
      await fetch("http://localhost:3000/api/v1/categorias")
    ).json();

    expect(Array.isArray(categorias)).toBe(true);
  });
});
