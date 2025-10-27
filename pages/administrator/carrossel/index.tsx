import LayoutPage from "../layout";
import { GetServerSidePropsContext } from "next";
import { UserType } from "@/models/user";
import { getAdminProps } from "../hoc";
import Carrossel from "@/components/Carrossel";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";

interface Props {
  user: UserType;
}

function CarrosselPageAdmin({ user }: Props) {
  const [imgCarrossel, setImgCarrossel] = useState([]);

  useEffect(() => {
    getImagesCarrossel().then(setImgCarrossel);
  }, []);

  return (
    <LayoutPage user={user}>
      <div>
        <Carrossel imagens={imgCarrossel} speed={1} />
        {imagensCarrossel()}
        <section id="actions">
          <button className="btn btn-primary gap-2 mt-4">
            <FontAwesomeIcon icon={faAdd} />
          </button>
        </section>
      </div>
    </LayoutPage>
  );

  async function getImagesCarrossel() {
    const resp = await fetch("/api/v1/carrossel");
    const data = await resp.json();
    console.log(data);
    return data;
  }

  function imagensCarrossel() {
    const itens = imgCarrossel.map((e: { url: string }, index) => (
      <div key={index} className="relative">
        <span className="absolute p-1 bg-red-500 right-0 flex items-center text-white cursor-pointer ">
          <FontAwesomeIcon icon={faAdd} />
        </span>
        {/*  eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={e?.url ?? ""}
          alt=""
          className="w-[30rem]  object-cover rounded-md"
        />
      </div>
    ));

    return <div className="flex gap-2 mt-4">{itens}</div>;
  }
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return getAdminProps(context);
}

export default CarrosselPageAdmin;
