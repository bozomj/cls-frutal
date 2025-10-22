import autenticator from "@/models/autenticator";
import User, { UserType } from "@/models/user";

import { GetServerSidePropsContext } from "next";

export async function getAdminProps(context: GetServerSidePropsContext) {
  const token = context.req.cookies.token || null;
  let user;

  if (token == null)
    return { redirect: { destination: "/", permanent: false } };

  try {
    const auth = autenticator.verifyToken(token);
    user = (await User.findById(auth.id))[0];

    if (user.is_admin !== true) throw new Error("User is not admin");

    console.log("User:", user);
  } catch (error) {
    console.log({ error: error });
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      user: JSON.parse(JSON.stringify(user)) as UserType,
    },
  };
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return getAdminProps(context);
}
