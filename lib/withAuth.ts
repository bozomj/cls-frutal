import autenticator from "@/models/autenticator";
import { GetServerSideProps, GetServerSidePropsContext } from "next";

export function withAuth(
  //   getServerSideProps?: GetServerSideProps,
  redirect: string,
): GetServerSideProps {
  return async (ctx: GetServerSidePropsContext) => {
    const token = ctx.req.cookies.token || "";

    try {
      const auth = autenticator.verifyToken(token);

      return {
        props: {
          userId: auth.id,
        },
      };
    } catch (error) {
      return {
        redirect: {
          destination: redirect,
          permanent: false,
        },
      };
    }
  };
}
