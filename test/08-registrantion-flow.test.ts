import database from "@/database/database";
import orchestrator from "./orchestrator";
import activation from "@/models/activation";
import webserver from "@/infra/webserver";

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

    const responseUser = await fetch(`${webserver.origin}/api/v1/user`, {
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

    expect(lastEmail.sender).toBe("<contato@bzmj.com.br>");
    expect(lastEmail.recipients[0]).toBe(`<${user.email}>`);
    expect(lastEmail.subject).toBe(
      "Ative seu cadastro em CLS-CLASSIFICADOS-FRUTAL",
    );
    expect(lastEmail.text).toContain(user.name);

    const activationTokenId = orchestrator.extractUUID(lastEmail.text);

    expect(lastEmail.text).toContain(
      `${webserver.origin}/cadastro/ativar/${activationTokenId}`,
    );

    const activationTokeObject = (
      await activation.findOneValidById(activationTokenId || "")
    )[0];

    console.log(activationTokeObject);
    expect(activationTokeObject.user_id).toBe(responseUserBody.id);
    expect(activationTokeObject.used_at).toBe(null);
  });

  test("Activation account", async () => {});
  test("Login", async () => {});
  test("get user information", async () => {});
});
