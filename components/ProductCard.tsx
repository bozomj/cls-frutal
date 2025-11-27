import { PostType } from "@/models/post";
import utils from "@/utils";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ReactNode, useState } from "react";
import Alert from "./Alert";
import { faShareFromSquare } from "@fortawesome/free-solid-svg-icons";
import VerticalDivider from "./VerticalDivider";

interface ProductCardProps {
  item: PostType;
  className?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  item,
  className,
}: ProductCardProps) => {
  const [showAlert, setShowAlert] = useState(<></>);

  return (
    <div
      className={`
        bg-gray-200 border-2 border-gray-200  p-2 rounded-2xl flex justify-center transition duration-400
         hover:border-gray-300  text-gray-800 ${className} 
        `}
    >
      <div className="flex flex-col w-full overflow-hidden gap-2 ">
        <span className="text-sm text-right">
          Publicado {utils.formatarData(`${item.created_at}`)}
        </span>
        <a href={`/posts/${item.id}`} target="_blank">
          <div className="flex flex-1 justify-center bg-gray-400 overflow-hidden rounded-2xl h-[12rem] relative">
            <span
              className="blur absolute h-full w-full block "
              style={{
                backgroundImage: `url(${utils.getUrlImageR2(
                  item.imageurl ?? ""
                )}) `,
                backgroundSize: "100% 100%",
                opacity: "30%",
              }}
            ></span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="object-contain absolute h-full"
              src={utils.getUrlImageR2(item.imageurl ?? "")}
              alt=""
            />
          </div>

          <div className="flex-1 flex text-gray-900 gap-2 w-[100%]  overflow-hidden flex-col py-2">
            <h2 className=" font-bold block  whitespace-wrap">
              {item.title ?? ""}
            </h2>
            <span className="h-5 text-green-700 font-bold block text-xl">
              R$: {item.valor}
            </span>
            <p className="text-sm truncate">{item.description}</p>
          </div>
        </a>
        <VerticalDivider height={1} />

        <Row className="h-7">
          <a
            className={
              "text-green-700 text-2xl hover:text-green-900 hover:text-3xl"
            }
            href={`https://wa.me/55${item.phone}`}
            target="_blank"
          >
            <FontAwesomeIcon icon={faWhatsapp} />
          </a>

          <button
            onClick={compartilhar}
            className={"text-teal-500 btn hover:text-teal-700 hover:text-2xl"}
            type="button"
          >
            <FontAwesomeIcon icon={faShareFromSquare} />
          </button>
        </Row>
      </div>
      {showAlert}
    </div>
  );

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
};

export default ProductCard;

function Row({
  children,
  className,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`flex items-center  justify-end text-xl gap-2 ${className}`}
    >
      {children}
    </div>
  );
}
