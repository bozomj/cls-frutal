import { PostType } from "@/models/post";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import Modal from "./Modal";
import utils from "@/utils";
import { faEdit } from "@fortawesome/free-regular-svg-icons";

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

  return (
    <article
      className={`bg-gray-300 relative flex-col text-white  gap-2 p-2 rounded-2xl flex justify-center ${className} `}
    >
      <div className="flex justify-between items-center">
        <span className="text-gray-800">
          pub: {utils.formatarData(`${item.created_at}` || "")}
        </span>
        <div id="list-actions" className="flex justify-end gap-4">
          <a
            href={`/posts/${item.id}`}
            className="text-green-800 hover:text-green-500 text-xl"
          >
            <FontAwesomeIcon icon={faEdit} />
          </a>
          <button
            aria-label="Deletar post"
            type="button"
            className="text-red-800  cursor-pointer font-bold hover:text-red-600 text-xl"
            onClick={async () => deletePostId(item.id ?? "")}
          >
            <FontAwesomeIcon icon={faTrash} />
            {showmodal}
          </button>
        </div>
      </div>

      <div className="flex flex-col w-full  overflow-hidden h-full gap-2 ">
        <div className="bg-gray-200 rounded-2xl flex justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="bg-gray-200 max-h-[10rem] w-fit self-center"
            src={utils.getUrlImage(item.imageurl)}
            alt={""}
          />
        </div>

        <div className=" flex text-gray-900 flex-col ">
          <span className="text-xl w-fit overflow-hidden">
            {item.title ?? ""}
          </span>
          <span className="w-full text-green-800">R$: {item.valor}</span>
          <span className="w-full">{item.description ?? ""}</span>
        </div>
      </div>
    </article>
  );

  async function deletePostId(id: string) {
    setShowModal(
      <Modal
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
    await fetch(`api/v1/posts/${id}`, {
      method: "DELETE",
    });

    // callback();
  }
};

export default ProductCardDashboard;
