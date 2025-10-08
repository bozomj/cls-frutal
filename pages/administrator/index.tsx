import autenticator from "@/models/autenticator";
import User, { UserType } from "@/models/user";
import { GetServerSideProps, GetServerSidePropsContext } from "next";

interface Props {
  user: UserType;
}

const AdministratorPage = ({ user }: Props) => {
  console.log(user);

  return (
    <>
      <div>Administrator Page</div>
      <div>{user.id}</div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const token = context.req.cookies.token || null;
  let user;

  if (token == null)
    return { redirect: { destination: "/login", permanent: false } };

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
};

export default AdministratorPage;
