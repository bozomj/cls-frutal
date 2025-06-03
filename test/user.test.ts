import database from "@/database/database";

describe("User", () => {
  it("mostrar tabelas", async () => {
    const tables = await database.query(
      "select table_name from information_schema.tables where table_schema = 'public';"
    );

    expect(tables).toEqual(expect.any(Array));
  });
});
