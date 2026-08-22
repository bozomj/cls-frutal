import Card from "@/components/Card";
import Header from "@/components/Header";
import autenticator from "@/models/autenticator";

import { faShoppingBag } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { GetServerSideProps, GetServerSidePropsContext } from "next";
import Link from "next/link";

const cardStyle = "bg-cyan-700 hover:bg-cyan-800 cursor-pointer text-white";

function NewPost() {
  return (
    <>
      <Header />
      <main className="flex-auto overflow-y-scroll py-2 bg-gray-300 flex-col flex justify-between gap-2 items-center ">
        <section className="h-[10rem] text-slate-800 w-full flex justify-evenly bg-slate-50  items-center">
          <div className="w-full md:w-[40rem]  relative ">
            <span className="text-xl p-2  text-center block">
              Ola! Antes de mais nada, o que você vai publicar?
            </span>

            <div className="absolute grid grid-cols-[repeat(auto-fit,minmax(8rem,1fr))] p-1 gap-2  w-full md:w-[40rem]">
              <Link href="/newpost/produto">
                <Card className={cardStyle}>
                  <FontAwesomeIcon icon={faShoppingBag} className="text-5xl" />
                  <span>Produto</span>
                </Card>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext,
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
