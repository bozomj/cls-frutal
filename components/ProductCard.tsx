import { PostType } from "@/models/post";
import utils from "@/utils";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import Alert from "./Alert";
import { faShare } from "@fortawesome/free-solid-svg-icons";

interface ProductCardProps {
  item: PostType;
  className?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  item,
  className,
}: ProductCardProps) => {
  const [showAlert, setShowAleret] = useState(<></>);

  async function compartilhar() {
    const txt = `${window.location.origin}/posts/${item.id}`;

    // Cria textarea invisível pra seleção
    const ta = document.createElement("textarea");
    //precisa estar no documento
    //  e nao pode estar oculto,
    // pode até estar fora da tela, mas nao oculto
    ta.value = txt;
    document.body.appendChild(ta);

    ta.select();

    try {
      document.execCommand("copy");
      setShowAleret(
        <Alert
          show
          msg={"Link Copiado com sucesso!"}
          onClose={function (): void {
            setShowAleret(<></>);
          }}
        />
      );
    } catch {
    } finally {
      document.body.removeChild(ta);
    }
  }

  return (
    <div
      className={`bg-gray-300  p-2 rounded-2xl flex justify-center hover:bg-gray-300 text-gray-800 ${className} `}
    >
      <div className="flex flex-col w-full overflow-hidden gap-2 ">
        <a href={`/posts/${item.id}`} target="_blank">
          <div className="flex flex-1 justify-center bg-gray-200 overflow-hidden rounded-2xl h-[15rem]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="object-contain"
              src={utils.getUrlImage(item.imageurl)}
              alt=""
            />
          </div>

          <div className="flex-1 flex text-gray-900 gap-2 w-[100%]  overflow-hidden flex-col py-2">
            <h2 className=" font-bold block  whitespace-wrap">
              {item.title ?? ""}
            </h2>
            <p className="text-sm truncate">{item.description}</p>
            <span className="h-5 text-green-700 font-bold block">
              R$: {item.valor}
            </span>
          </div>
        </a>

        <div className="flex justify-between">
          <span className="text-xl">{item.name}</span>
          <span>Publicado {utils.formatarData(`${item.created_at}`)}</span>
        </div>
        <div className=" flex items-end  justify-end text-2xl gap-2">
          <a
            href={`https://wa.me/55${item.phone}`}
            target="_blank"
            className="rounded-3xl bg-green-800 w-10 h-10 flex items-center justify-center p-2 text-white  hover:bg-green-600 transition duration-200"
          >
            <FontAwesomeIcon icon={faWhatsapp} />
          </a>

          <button
            onClick={compartilhar}
            className="rounded-3xl cursor-pointer bg-cyan-800 w-10 h-10 flex items-center justify-center p-2 text-white self-end hover:bg-cyan-500 transition duration-200"
          >
            <FontAwesomeIcon icon={faShare} />
          </button>
        </div>
      </div>
      {showAlert}
    </div>
  );
};

export default ProductCard;
