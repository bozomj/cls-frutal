import { PostType } from "@/models/post";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { faPhone } from "@fortawesome/free-solid-svg-icons";
import Modal from "./Modal";
import utils from "@/utils";

interface ProductCardDashboardProps {
  item: PostType;
  className?: string;
}

const ProductCardDashboard: React.FC<ProductCardDashboardProps> = ({
  item,
  className,
}: ProductCardDashboardProps) => {
  const [showmodal, setShowModal] = useState(<></>);
  const [deleted, setDeleted] = useState(false);

  if (deleted) return null;

  function linkFone(phone: string) {
    return `https://wa.me/55${phone}?text=[Classificados Frutal] - fiquei interessado em seu produto `;
  }

  return (
    <article
      className={`bg-gray-100 relative  p-2 rounded-2xl flex justify-center ${className}`}
    >
      <div className="flex flex-col w-full  overflow-hidden h-full gap-2 ">
        <div className="flex justify-center bg-gray-200 rounded-2xl overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="flex-1   bg-gray-200   min-h-[250px]"
            src={utils.getUrlImage(item.imageurl)}
            alt={""}
          />
        </div>
        <div className=" flex text-gray-900 gap-2 truncate overflow-hidden flex-col">
          <span className="text-2xl">{item.title ?? ""}</span>
          <span className="">{item.description ?? ""}</span>
          <span className="">R$: {item.valor}</span>

          <div className=" flex items-center gap-4">
            <a
              href={linkFone(item.phone)}
              target="_blank"
              aria-label="Whatsapp"
              rel="noopener noreferrer"
            >
              <FontAwesomeIcon
                icon={faWhatsapp}
                className="text-3xl text-green-900"
              />
            </a>
            <a href="#" aria-label="Email">
              <FontAwesomeIcon
                icon={faPhone}
                className="text-1xl text-blue-500"
              />
              <span>{item.email}</span>
            </a>
          </div>
        </div>
        <button
          aria-label="Deletar post"
          type="button"
          className="bg-red-800  cursor-pointer font-bold w-3/6 self-end rounded p-1 hover:bg-red-600"
          onClick={async () => deletePostId(item.id ?? "")}
        >
          Deletar
        </button>
      </div>
      {showmodal}
    </article>
  );

  async function deletePostId(id: string) {
    setShowModal(
      <Modal
        show={true}
        onConfirm={async function (): Promise<void> {
          await deletePost(id);
          setDeleted(true);
          setShowModal(<></>);
        }}
        onClose={function (): void {
          setShowModal(<></>);
        }}
      >
        {"Deseja deletar este post?"}
      </Modal>
    );
  }

  async function deletePost(
    id: string
    //  callback: () => void
  ) {
    const result = await fetch(`api/v1/posts/${id}`, {
      method: "DELETE",
    });
    console.log(await result.json());

    // callback();
  }
};

export default ProductCardDashboard;
