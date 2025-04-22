import database from "@/database/database";
import User from "@/models/user";

describe("User", () => {
  it("mostrar tabelas", async () => {
    const tables = await database.query(
      "select table_name from information_schema.tables where table_schema = 'public';"
    );

    console.log("tables", tables);
    expect(tables).toEqual(expect.any(Array));
  });
});
