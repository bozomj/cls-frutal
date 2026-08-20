import User from "@/models/user";
import orchestrator from "./orchestrator";
import insertCategorias from "@/seeds/insertCategorias";
import { UserDBType } from "@/shared/user_types";

beforeAll(async () => {
  await orchestrator.cleanDatabase();
  await orchestrator.runPendingMigrations();
  await insertCategorias();
});

describe("User", () => {
  let userNotAdmin: Partial<UserDBType>;
  let userAdmin: Partial<UserDBType>;

  it("insert user admin", async () => {
    const result = await fetch(
      `http://localhost:3000/api/v1/user/insertadmin_?tokenUrl=${process.env.USERMASTER_TOKEN_URL}`,
      {
        method: "GET",
      },
    );
    const resultJson = await result.json();
    expect(result.status).toBe(201);
    expect(resultJson.message).toEqual("usuario cadastrado com sucesso!");
    expect(resultJson.user.is_admin).toBe(true);
    userAdmin = resultJson.user;
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
    userNotAdmin = resultBody.user;

    expect(resultBody.user.is_admin).toBe(false);
  });

  it("erro ao tentar atualizar usuario com id de outro e nao sendo admin", async () => {
    userNotAdmin.name = "Usuario alterado";
    const alteredUser = await User.update(userNotAdmin);
    // expect(alteredUser.name).toBe("francinildo");
  });
});
