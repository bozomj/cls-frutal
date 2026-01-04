import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import Modal from "./Modal";
import utils from "@/utils";
import { faEdit } from "@fortawesome/free-regular-svg-icons";
import Image from "next/image";
import { useBackdrop } from "@/ui/backdrop/useBackdrop";
import httpPost from "@/http/post";
import { statusColor } from "@/constants/statusColor";
import { PostDetailType } from "@/shared/post_types";

interface ProductCardDashboardProps {
  item: PostDetailType;
  className?: string;
}

const ProductCardDashboard: React.FC<ProductCardDashboardProps> = ({
  item,
  className,
}: ProductCardDashboardProps) => {
  const [deleted, setDeleted] = useState(false);
  const usebackdrop = useBackdrop();

  if (deleted) return null;

  return (
    <article
      className={`bg-gray-200 relative flex-col text-white gap-2 p-2 rounded-2xl flex justify-center border-2 ${
        statusColor[item.status].border
      } ${className ?? ""}`}
    >
      <div className="flex  justify-between items-center">
        <p className="text-gray-800">
          pub: {utils.formatarData(`${item.created_at}` || "")}
        </p>
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
          </button>
        </div>
      </div>

      <div className="flex w-full  overflow-hidden h-full gap-2 ">
        <div className="bg-gray-200 rounded-xl h-20 relative min-w-1/3">
          <Image
            src={utils.getUrlImageR2(item.imageurl ?? "")}
            fill
            alt=""
            loading="eager"
            className="object-contain"
          />
        </div>

        <div className=" flex text-gray-900 flex-col relative min-w-2/3">
          <span className="truncate font-bold text-gray-800">
            {item.title ?? ""}
          </span>

          <p className=" truncate ">{item.description ?? ""}</p>
          <p className="w-11/12 text-green-800 font-bold">
            <span className="text-xs">R$: </span>
            <span className="">
              {utils.formatarMoeda(item.valor.toString())}
            </span>
          </p>
          <span
            className={`${
              statusColor[item.status].text
            } text-end font-bold mr-2 `}
          >
            Status: {item.status}
          </span>
        </div>
      </div>
    </article>
  );

  async function deletePostId(id: string) {
    usebackdrop.openContent(
      <Modal
        onConfirm={async function (): Promise<void> {
          await httpPost.deletePost(id);
          setDeleted(true);
          usebackdrop.closeContent();
        }}
        onClose={function (): void {
          usebackdrop.closeContent();
        }}
      >
        {"Deseja deletar este post?"}
      </Modal>
    );
  }
};

export default ProductCardDashboard;
