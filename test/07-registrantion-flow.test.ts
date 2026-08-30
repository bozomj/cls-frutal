import database from "@/database/database";
import orchestrator from "./orchestrator";
import activation from "@/models/activation";
import webserver from "@/infra/webserver";
import User from "@/models/user";
import autenticator from "@/models/autenticator";
import sessions from "@/models/sessions";

beforeAll(async () => {
  await orchestrator.deleteAllEmails();
  await database.query("delete from sessions");
  await database.query("delete from user_activation_tokens");
  await database.query("delete from users");
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

  test("Erro ao logar sem ativar!", async () => {
    const userResult = await fetch(`${webserver.origin}/api/v1/login`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    expect(userResult.status).toBe(401);
    const userBody = await userResult.json();
    expect(userBody).toEqual({
      message: "Usuario sem permissão, verifique sua ativação!",
      codeError: "01",
    });
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

  test("Login com sucesso!", async () => {
    const userResult = await fetch(`${webserver.origin}/api/v1/login`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    expect(userResult.status).toBe(200);
    const userBody = await userResult.json();
    const userData = autenticator.verifyToken(userBody.token);

    const dateLimite = new Date();
    dateLimite.setDate(dateLimite.getDate() + 6);

    const refresh = (await sessions.getRefreshTokenByUserId(userData.id))[0];

    expect(refresh.user_id).toBe(userData.id);
    expect(new Date(refresh.expires_at).getTime()).toBeGreaterThan(
      dateLimite.getTime(),
    );

    const headers = userResult.headers;
    const cookies = headers.getSetCookie();

    let list: { [key: string]: string } = {};
    cookies.map((cookie) => {
      const str = cookie.replace("=", "-=-");
      const [nome, valor] = str.split("-=-");

      list[nome] = valor;
    });

    expect(list.token).toBeTruthy();
    expect(list.refreshToken).toBeTruthy();
  });

  test("Erro ao tentar ativar novamente a conta", async () => {
    const activationResponse = await fetch(
      `${webserver.origin}/api/v1/activations/${activationTokenId}`,
      {
        method: "PATCH",
      },
    );

    expect(activationResponse.status).toBe(500);

    const activationResponseBody = await activationResponse.json();
    expect(activationResponseBody).toEqual({
      message: "Token expirado ou já utilizado",
    });
  });

  test("get user information", async () => {});
});
