import autenticator from "@/models/autenticator";
import { UserType } from "@/models/user";

import { GetServerSidePropsContext } from "next";

export async function getAdminProps(context: GetServerSidePropsContext) {
  const token = context.req.cookies.token || null;
  let user;

  if (token == null)
    return { redirect: { destination: "/", permanent: false } };

  try {
    const auth = autenticator.verifyToken(token);
    const baseUrl = process.env.URLDOMAIN || "http://localhost:3000";
    // user = (await User.findById(auth.id))[0];
    const result = await fetch(baseUrl + "/api/v1/user/id/" + auth.id);
    user = await result.json();

    if (user.is_admin !== true) throw new Error("User is not admin");
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
