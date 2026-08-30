import { Header } from "@/components";
import Card from "@/components/Card";
import ListTile from "@/components/ListTile";
import { faDartLang } from "@fortawesome/free-brands-svg-icons";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";

export default function ActivationUser(props: any) {
  const router = useRouter();
  const activationToken = router.query.activationTokenId;
  const { message, status } = props;

  return (
    <>
      <Header titulo="Ativar Usuario" />
      <div className=" flex bg-gray-300  flex-col h-screen text-slate-800 p-2">
        <Alert status={200} />
      </div>
    </>
  );

  function Alert({ status }: { status: number }) {
    const sts: Record<number, string> = {
      200: "bg-green-200 ",
      500: "bg-amber-600 text-white! ",
    };

    return (
      <ListTile
        title={message}
        onClick={function (): void {}}
        icon={faDartLang}
        className={`${sts[status]}`}
      />
    );
  }
}

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext,
) => {
  const queryToken = context.query.activationTokenId as string;
  const activationTokenId = queryToken.trim();

  const activate = await fetch(
    `http://localhost:3000/api/v1/activations/${activationTokenId}`,
    {
      method: "PATCH",
    },
  );

  const activateBody = await activate.json();

  if (activate.status === 200) {
    return {
      props: {
        message: "Ativação realizada com Sucesso!",
        status: 200,
      },
    };
  } else {
    return {
      props: {
        message: activateBody.message,
        status: 500,
      },
    };
  }
};
