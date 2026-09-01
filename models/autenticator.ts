import jwt from "jsonwebtoken";
import { GetServerSidePropsContext } from "next";
import webserver from "@/infra/webserver";

function createToken(id: string) {
  const secret = process.env.JWT_SECRET || "";
  const token = jwt.sign({ id: id }, secret, { expiresIn: "15m" });
  return token;
}

function verifyToken(token: string) {
  try {
    const secret = process.env.JWT_SECRET || "";
    const decoded = jwt.verify(token, secret) as { id: string };

    return decoded;
  } catch (e) {
    throw { message: "erro com o token, token invalido ou ausente!" };
  }
}

async function isAuthenticated() {
  const response = await fetch(`${webserver.origin}/api/v1/login`, {
    method: "GET",
  });
  const data = await response.json();

  return data;
}

function redirectNotToken(ctx: GetServerSidePropsContext, destination: string) {
  const token = ctx.req.cookies.token || "";

  try {
    const auth = autenticator.verifyToken(token);

    return {
      props: {
        ctx: auth.id,
      },
    };
  } catch (error) {
    return {
      redirect: {
        destination: destination,
        permanent: false,
      },
    };
  }
}

const autenticator = {
  createToken,
  verifyToken,
  isAuthenticated,
  redirectNotToken,
};

export default autenticator;
