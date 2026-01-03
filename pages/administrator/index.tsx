import { useEffect } from "react";

import { GetServerSidePropsContext } from "next";
import LayoutPage from "@/components/layout";
import { getAdminProps } from "@/lib/hoc";
import { UserDBType } from "@/shared/user_types";

interface Props {
  user: UserDBType;
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
