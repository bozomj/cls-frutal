import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Card from "./Card";
import { faRemove } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import { ImageDBType } from "@/shared/Image_types";

interface ImageCardPreviewProps {
  image: ImageDBType;
  active?: boolean;
  alertMsg?: string;
  onClick: (image: ImageDBType) => void;
  className?: string;
  onImageClick?: () => void;
}

function ImageCardPreview({
  image,
  active = true,
  alertMsg = "",
  onClick,
  className,
  onImageClick,
}: ImageCardPreviewProps) {
  console.log(active);
  return (
    <div
      className={`w-fit h-full relative shrink-0 max-w-2/3 text-white ${className}`}
    >
      <RemoveButton />
      <Card className="relative border-3 h-full border-cyan-600 bg-cyan-200 peer-hover:bg-red-500/40 peer-hover:border-red-500 overflow-hidden">
        <Image
          className={
            (active ? `` : `opacity-40!`) +
            " rounded-md cursor-pointer h-full w-full  object-cover"
          }
          src={image.url}
          alt=""
          width={500}
          height={500}
          onClick={onImageClick}
        />

        <span className="absolute left-0 top-[80%] bg-accent w-full text-center">
          {alertMsg}
        </span>
      </Card>
    </div>
  );

  function RemoveButton() {
    return (
      <button
        type="button"
        className={`z-40 absolute cursor-pointer bg-red-900 hover:bg-red-500 rounded-full h-6 w-6 p-1 -right-2 -top-2 peer flex justify-center `}
        onClick={() => onClick(image)}
      >
        <FontAwesomeIcon icon={faRemove} />
      </button>
    );
  }
}

export default ImageCardPreview;
