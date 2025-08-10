import Card from "@/components/Card";
import Header from "@/components/Header";
import autenticator from "@/models/autenticator";
import { faHandshake } from "@fortawesome/free-regular-svg-icons";
import { faCar, faShoppingBag } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { GetServerSideProps, GetServerSidePropsContext } from "next";
import Link from "next/link";

const cardStyle = "bg-cyan-950 hover:bg-cyan-800 cursor-pointer";

function NewPost() {
  return (
    <>
      <Header />
      <main className="flex-auto overflow-y-scroll bg-gray-300 flex-col flex justify-between gap-2 items-center">
        <section className="w-full">
          <span className="h-[10rem] w-full flex justify-evenly bg-cyan-700 relative items-center">
            <h1 className="text-xl">
              Ola! Antes de mais nada, o que você vai publicar?
            </h1>

            <span className="absolute top-[70%] grid grid-cols-[repeat(auto-fit,minmax(8rem,1fr))] p-1 gap-2  w-full md:w-[920px]">
              <Link href="/newpost/produto">
                <Card className={cardStyle}>
                  <FontAwesomeIcon icon={faShoppingBag} className="text-5xl" />
                  <span>Produto</span>
                </Card>
              </Link>

              <Card className={cardStyle}>
                <FontAwesomeIcon icon={faCar} className="text-5xl" />
                Imóveis
              </Card>

              <Card className={cardStyle}>
                <FontAwesomeIcon icon={faHandshake} className="text-5xl" />
                Serviços
              </Card>
            </span>
          </span>
        </section>
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const token = context.req.cookies.token || "";
  let auth = null;
  try {
    auth = autenticator.verifyToken(token);
  } catch (error) {
    console.log({
      redirect: error,
    });
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: {
      ctx: auth.id,
    },
  };
};

export default NewPost;
