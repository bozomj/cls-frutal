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
import VerticalDivider from "./VerticalDivider";

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
    <div className="shadow-sm shadow-gray-400 rounded-2xl bg-gray-50">
      <article
        className={`relative flex-col  gap-2 rounded-2xl flex justify-center  ${className ?? ""}`}
        onClick={(e) => {
          const result = diferencaEmDias(
            new Date(item.expires_at ?? ""),
            new Date(Date.now()),
          );
        }}
      >
        <div
          className={
            "flex  justify-between items-center  p-2 rounded-t-2xl " +
            statusColor[item.status].bg
          }
        >
          <div className="flex justify-between pr-2 flex-1">
            <p className="text-gray-800 text-xs">
              pub: {utils.formatarData(`${item.created_at}` || "")}
            </p>
            <span className={`text-gray-800 text-xs`}>
              Expira: {utils.formatarData(item.expires_at || "")}
            </span>
          </div>
        </div>

        <div className="flex w-full  overflow-hidden h-full gap-2 px-2  ">
          <div className=" rounded-xl h-20 relative min-w-1/3 ">
            <Image
              src={utils.getUrlImageR2(item.imageurl ?? "")}
              fill
              alt=""
              loading="eager"
              className="object-cover"
            />
          </div>
          <div className=" flex text-gray-900 flex-col relative min-w-2/3 justify-between">
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
          </div>
        </div>
      </article>
      <span className="p-2 block">
        <VerticalDivider height={1} />
      </span>
      <div
        id="list-actions"
        className="flex justify-end gap-4 items-center pr-4 pb-2"
      >
        <span
          className={
            `${statusColor[item.status].text}  font-bold mr-2 pl-2 text-xs ` +
            "flex-1"
          }
        >
          Status: {item.status}
        </span>
        <a
          href={utils.createPostUrl(item)}
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
      </Modal>,
    );
  }

  function diferencaEmDias(data1: Date | string, data2: Date | string): number {
    const d1 = new Date(data1);
    const d2 = new Date(data2);

    const utc1 = Date.UTC(d1.getFullYear(), d1.getMonth(), d1.getDate());
    const utc2 = Date.UTC(d2.getFullYear(), d2.getMonth(), d2.getDate());

    return Math.floor((utc1 - utc2) / (1000 * 60 * 60 * 24));
  }
};

export default ProductCardDashboard;
