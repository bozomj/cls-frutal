// teste para verificar se a conexão com o banco de dados está ok

import database from "@/database/database";
import migrator from "@/models/migrator";

async function cleanDatabase() {
  const client = await database.getNewClient();
  await client.query("drop schema public cascade; create schema public;");
  await client.end();
}

beforeAll(async () => {
  // await cleanDatabase();
});

afterAll(async () => {
  // await cleanDatabase();
});

describe("database", () => {
  it("Listar migrações pendentes", async () => {
    const result = await migrator.listPendingMigrations();
    expect(result).toEqual(expect.any(Array));
  });
  it("Rodar migrações pendentes", async () => {
    const result = await migrator.runPendingMigrations();
    expect(result).toEqual(expect.any(Array));
  });

  it("Mostrar zero migrações pendentes", async () => {
    const result = await migrator.listPendingMigrations();
    expect(result).toEqual([]);
  });
});
