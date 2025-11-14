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
  const [showAlert, setShowAlert] = useState(<></>);

  async function compartilhar() {
    const txt = `${window.location.origin}/posts/${item.id}`;
    navigator.clipboard.writeText(txt);

    setShowAlert(
      <Alert
        show
        msg={"Link Copiado com sucesso!"}
        onClose={() => setShowAlert(<></>)}
      />
    );
  }

  return (
    <div
      className={`
        bg-gray-50 border-2 border-gray-50  p-2 rounded-2xl flex justify-center transition duration-400
         hover:border-gray-300  text-gray-800 ${className} 
        `}
    >
      <div className="flex flex-col w-full overflow-hidden gap-2 ">
        <span className="text-sm text-right">
          Publicado {utils.formatarData(`${item.created_at}`)}
        </span>
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
            <span className="h-5 text-green-700 font-bold block">
              R$: {item.valor}
            </span>
            <p className="text-sm truncate">{item.description}</p>
          </div>
        </a>

        <div className="flex justify-between">
          <span className="text-xl">{item.name}</span>
        </div>
        <div className=" flex items-end  justify-end text-xl gap-2">
          <a
            className={styleWhatsapp}
            href={`https://wa.me/55${item.phone}`}
            target="_blank"
          >
            <FontAwesomeIcon icon={faWhatsapp} />
          </a>

          <button onClick={compartilhar} className={styleCompartilhar}>
            <FontAwesomeIcon icon={faShare} />
          </button>
        </div>
      </div>
      {showAlert}
    </div>
  );
};

export default ProductCard;

const styleCompartilhar =
  "rounded-3xl cursor-pointer bg-cyan-800 w-8 h-8 flex items-center justify-center p-2 text-white self-end hover:bg-cyan-500 transition duration-200";

const styleWhatsapp =
  "rounded-3xl bg-green-800 w-8 h-8 flex items-center justify-center p-2 text-white  hover:bg-green-600 transition duration-200";
