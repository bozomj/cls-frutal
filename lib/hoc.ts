import webserver from "@/infra/webserver";
import autenticator from "@/models/autenticator";
import { UserDBType } from "@/shared/user_types";

import { GetServerSidePropsContext } from "next";

export async function getAdminProps(context: GetServerSidePropsContext) {
  const cookieHeader = context.req.headers.cookie || "";
  let user;

  try {
    const result = await fetch(`${webserver.origin}/api/v1/user`, {
      headers: {
        Cookie: cookieHeader,
      },
    });
    const resultBody = await result.json();
    user = resultBody.user;
    console.log(user);

    if (user.is_admin !== true) throw { message: "User is not admin" };
  } catch (error) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      user: JSON.parse(JSON.stringify(user)) as UserDBType,
    },
  };
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return getAdminProps(context);
}
