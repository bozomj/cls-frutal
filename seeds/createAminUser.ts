import password from "../models/password";
import User from "../models/user";

async function createAdminUser() {
  const pws = process.env.USERMASTER_PASSWORD;
  const name = process.env.USERMASTER_NAME;
  const email = process.env.USERMASTER_EMAIL;

  const user = await User.create({
    name,
    email,
    password: pws,
    is_admin: true,
  });

  return user;
}

export default createAdminUser;
