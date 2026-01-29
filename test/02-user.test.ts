import database from "@/database/database";

describe("User", () => {
  it("mostrar tabelas", async () => {
    const tables = await database.query(
      "select table_name from information_schema.tables where table_schema = 'public';",
    );

    expect(tables).toEqual(expect.any(Array));
  });

  it("insert user admin", async () => {
    const result = await fetch(
      "http://localhost:3000/api/v1/user/insertadmin_",
      {
        method: "POST",
      },
    );
    await result.text();
  });

  it("result usuario comum ao tentar criar usuario admin", async () => {
    const result = await fetch("http://localhost:3000/api/v1/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "falso usuario admin",
        email: "notadmin@hotmail.com",
        password: "123456",
        phone: "34997668902",
        is_admin: true,
      }),
    });

    expect(result.status).toBe(201);
    const resultBody = await result.json();
    expect(resultBody.user.is_admin).toBe(false);
  });
});
