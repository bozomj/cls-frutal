import LayoutPage from "../layout";
import { GetServerSidePropsContext } from "next";
import { UserType } from "@/models/user";
import { getAdminProps } from "../hoc";
import Carrossel from "@/components/Carrossel";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface Props {
  user: UserType;
}

function CarrosselPageAdmin({ user }: Props) {
  const imgCarrossel = [
    {
      src: "https://img.cdndsgni.com/preview/10028403.jpg",
    },
    {
      src: "https://m.media-amazon.com/images/G/32/kindle/email/2025/03_Marco/Pagina_Recomendacoes_para_voce/1500x200_Narrow.jpg",
    },
    {
      src: "https://img.freepik.com/vetores-gratis/banner-do-linkedin-de-negocios-de-gradiente_23-2150091566.jpg",
    },
    {
      src: "https://img.cdndsgni.com/preview/13138247.jpg",
    },
    {
      src: "https://img.freepik.com/vetores-gratis/banner-do-linkedin-de-negocios-de-gradiente_23-2150091566.jpg",
    },
  ];

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

  function imagensCarrossel() {
    const itens = imgCarrossel.map((e, index) => (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        key={index}
        src={e?.src ?? ""}
        alt=""
        className="w-32 h-20 object-cover rounded-md"
      />
    ));

    return <div className="flex gap-2 mt-4">{itens}</div>;
  }
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return getAdminProps(context);
}

export default CarrosselPageAdmin;
