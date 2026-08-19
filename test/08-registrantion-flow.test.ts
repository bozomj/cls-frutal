import database from "@/database/database";
import orchestrator from "./orchestrator";
import activation from "@/models/activation";
import webserver from "@/infra/webserver";
import User from "@/models/user";

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
  let activationTokenId: string | null;

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
      updated_at: responseUserBody.updated_at,
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

    activationTokenId = orchestrator.extractUUID(lastEmail.text);

    expect(lastEmail.text).toContain(
      `${webserver.origin}/cadastro/ativar/${activationTokenId}`,
    );

    const activationTokeObject = await activation.findOneValidById(
      activationTokenId || "",
    );

    expect(activationTokeObject.user_id).toBe(responseUserBody.id);
    expect(activationTokeObject.used_at).toBe(null);
  });

  test("Activation account", async () => {
    const activationResponse = await fetch(
      `${webserver.origin}/api/v1/activations/${activationTokenId}`,
      {
        method: "PATCH",
      },
    );

    expect(activationResponse.status).toBe(200);

    const activationResponseBody = await activationResponse.json();
    expect(Date.parse(activationResponseBody.used_at)).not.toBeNaN();

    const activatedUser = await User.findByEmail(user.email);
    expect(activatedUser[0].features).toEqual(["create:session"]);
  });

  test("Login", async () => {});

  test("get user information", async () => {});
});
