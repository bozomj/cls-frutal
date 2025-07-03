import bcrypt from "bcryptjs";

async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

async function comparePassword(password: string, hash: string) {
  return await bcrypt.compare(password, hash);
}

const password = { hashPassword, comparePassword };

export default password;
