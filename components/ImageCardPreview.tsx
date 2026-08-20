import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Card from "./Card";
import { faRemove } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import { ImageDBType } from "@/shared/Image_types";
import OwnerGuard from "./guards/OwnerGuard";

interface ImageCardPreviewProps {
  image: ImageDBType;
  active?: boolean;
  alertMsg?: string;
  onClick?: (image: ImageDBType) => void;
  className?: string;
  onImageClick?: () => void;
  circle?: boolean;
}

function ImageCardPreview({
  image,
  active = true,
  alertMsg = "",
  circle = false,
  onClick,
  className,
  onImageClick,
}: ImageCardPreviewProps) {
  const avatar = circle ? " rounded-full! p-0! border-5 " : " ";
  return (
    <div
      className={`relative w-1/3 lg:max-w-1/6 md:max-w-1/4  text-white shrink ${className}`}
    >
      <div className={(active ? `` : `opacity-40! `) + `h-full p-1 `}>
        <RemoveButton />
        <Card
          className={
            avatar +
            " relative  border-2 w-full h-full border-slate-400 bg-slate-200 peer-hover:bg-red-500/40 peer-hover:border-red-500 overflow-hidden "
          }
        >
          <Image
            className={
              " rounded-md cursor-pointer h-full w-full  object-cover "
            }
            src={image.url}
            alt=""
            width={500}
            height={500}
            onClick={onImageClick}
          />
        </Card>
      </div>
      <OwnerGuard isOwner={alertMsg.length > 0}>
        <div className="absolute left-0 bottom-0 px-1 w-full h-2/12 md:h-1/10">
          <span className="bg-accent text-[1.rem]  w-full rounded-b-md  h-full flex justify-center items-center ">
            {alertMsg}
          </span>
        </div>
      </OwnerGuard>
    </div>
  );

  function RemoveButton() {
    return (
      <button
        type="button"
        className={`z-[9] absolute cursor-pointer bg-red-700 hover:bg-red-500 rounded-full h-7 w-7 p-1 right-2 top-1 peer flex justify-center items-center`}
        onClick={() => onClick!(image)}
      >
        <FontAwesomeIcon icon={faRemove} />
      </button>
    );
  }
}

export default ImageCardPreview;
