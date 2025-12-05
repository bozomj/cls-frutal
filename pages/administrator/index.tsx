import { UserType } from "@/models/user";

import LayoutPage from "./layout";
import { useEffect } from "react";
import { getAdminProps } from "../../lib/hoc";
import { GetServerSidePropsContext } from "next";

interface Props {
  user: UserType;
}

const AdministratorPage = ({ user }: Props) => {
  useEffect(() => {}, []);

  return (
    <LayoutPage user={user}>
      <section
        id="container"
        className="flex flex-col gap-1 flex-1 overflow-hidden p-1"
      >
        teste
      </section>
    </LayoutPage>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return getAdminProps(context);
}

export default AdministratorPage;
