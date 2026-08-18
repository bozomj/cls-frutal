import database from "@/database/database";
import orchestrator from "./orchestrator";
import activation from "@/models/activation";

const webserver = "http://localhost:3000";

beforeAll(async () => {
  await orchestrator.deleteAllEmails();
});

describe("Use case: registtration flow (all successfull)", () => {
  const user = {
    name: "user activation",
    email: "bzmj@hotmail.com",
    password: "123456",
    phone: "34997668902",
  };

  let responseUserBody: any;

  test("Create user account", async () => {
    await database.query("delete from users where email <> 'bozomj@gmail.com'");

    const responseUser = await fetch(`${webserver}/api/v1/user`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    expect(responseUser.status).toBe(201);
    responseUserBody = (await responseUser.json()).user;

    expect(responseUserBody).toEqual({
      id: responseUserBody.id,
      name: user.name,
      email: user.email,
      is_admin: false,
      createdAt: responseUserBody.createdAt,
      features: ["read:activation_token"],
      phone: user.phone,
      password: responseUserBody.password,
    });
  });

  test("Receive activation email", async () => {
    const lastEmail = await orchestrator.getLastEmail();

    const activationToken = await activation.findOneByUserId(
      responseUserBody.id,
    );

    expect(lastEmail.sender).toBe("<contato@bzmj.com.br>");
    expect(lastEmail.recipients[0]).toBe(`<${user.email}>`);
    expect(lastEmail.subject).toBe(
      "Ative seu cadastro em CLS-CLASSIFICADOS-FRUTAL",
    );

    expect(lastEmail.text).toContain(user.name);
    expect(lastEmail.text).toContain(activationToken[0].id);
    console.log(lastEmail.text);
  });

  test("Login", async () => {});
  test("get user information", async () => {});
});
