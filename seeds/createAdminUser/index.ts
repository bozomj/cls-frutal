import User from "@/models/user";

export default async function createAminUser() {
  const user = {
    name: process.env.USERMASTER_NAME || "",
    email: process.env.USERMASTER_EMAIL || "",
    password: process.env.USERMASTER_PASSWORD || "",
    phone: "34997668902",
    is_admin: true,
  };

  try {
    User.create(user);
  } catch (error) {
    console.log(error);
  }
}
