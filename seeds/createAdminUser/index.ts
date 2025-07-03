import User from "@/models/user";

export default function createAminUser() {
  const user = {
    name: process.env.USERMASTER_NAME || "",
    email: process.env.USERMASTER_EMAIL || "",
    password: process.env.USERMASTER_PASSWORD || "",
  };

  User.create(user);
}
