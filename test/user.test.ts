import database from "@/database/database";

describe("User", () => {
  it("mostrar tabelas", async () => {
    const tables = await database.query(
      "select table_name from information_schema.tables where table_schema = 'public';"
    );

    console.log(tables);
    expect(tables).toEqual(expect.any(Array));
  });

  it("insert user admin", async () => {
    const user = await fetch("http://localhost:3000/api/v1/user/insertadmin_", {
      method: "POST",
    });

    console.log(await user.json());
  });
});
