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
  key: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  item,
  className,
  key,
}: ProductCardProps) => {
  const [showAlert, setShowAleret] = useState(<></>);

  return (
    <div
      key={key}
      className={`bg-gray-300  p-2 rounded-2xl flex justify-center hover:bg-gray-300 text-gray-800 ${className}`}
    >
      <div className="flex flex-col w-full overflow-hidden h-full gap-2 ">
        <a href={`/posts/${item.id}`} target="_blank">
          <div className="flex justify-center bg-gray-200 rounded-2xl overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="flex-1   bg-gray-200   min-h-[250px]"
              src={utils.getUrlImage(item.imageurl)}
              alt=""
            />
          </div>

          <div className=" flex text-gray-900 gap-2 w-[100%] truncate overflow-hidden flex-col py-2">
            <h2 className="h-5 font-bold block">{item.title ?? ""}</h2>
            <p className="text-sm truncate">{item.description}</p>
            <span className="h-5 text-green-700 font-bold block">
              R$: {item.valor}
            </span>
          </div>
        </a>
        <div className=" flex items-end  justify-between">
          <div className="flex flex-col">
            <span>{item.name}</span>
            <a href={`https://wa.me/55${item.phone}`} target="_blank">
              <FontAwesomeIcon
                icon={faWhatsapp}
                className="text-3xl text-green-900 hover:text-green-700"
              />
            </a>
          </div>
          <button
            onClick={async () => {
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
            }}
          >
            <FontAwesomeIcon
              icon={faShare}
              className="text-cyan-950 text-2xl hover:text-cyan-700 cursor-pointer"
            />
          </button>
        </div>
      </div>
      {showAlert}
    </div>
  );
};

export default ProductCard;
