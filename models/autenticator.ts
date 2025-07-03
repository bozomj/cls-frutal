import jwt from "jsonwebtoken";

function createToken(id: string) {
  const secret = process.env.JWT_SECRET || "";
  const token = jwt.sign({ id: id }, secret, { expiresIn: "12h" });
  return token;
}

function verifyToken(token: string) {
  const secret = process.env.JWT_SECRET || "";
  const decoded = jwt.verify(token, secret) as { id: string };

  return decoded;
}

async function isAuthenticated() {
  const response = await fetch("/api/v1/login", {
    method: "GET",
  });
  const data = await response.json();

  return data;
}

const autenticator = {
  createToken,
  verifyToken,
  isAuthenticated,
};

export default autenticator;
