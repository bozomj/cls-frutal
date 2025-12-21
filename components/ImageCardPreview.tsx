import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Card from "./Card";
import { faRemove } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";

type ImageFile = {
  id: number;
  file: File;
  url: string;
};

interface ImageCardPreviewProps {
  image: ImageFile;
  onClick: (image: ImageFile) => void;
  className?: string;
  onImageClick?: () => void;
}

function ImageCardPreview({
  image,
  onClick,
  className,
  onImageClick,
}: ImageCardPreviewProps) {
  return (
    <div
      className={`w-fit h-full relative shrink-0 max-w-2/3 text-white ${className}`}
    >
      <RemoveButton />
      <Card className="border-3 h-full border-cyan-600 bg-cyan-800 peer-hover:bg-red-500/40 peer-hover:border-red-500">
        <Image
          className="rounded-md cursor-pointer h-full object-cover"
          src={image.url}
          alt=""
          width={150}
          height={150}
          onClick={onImageClick}
        />
      </Card>
    </div>
  );

  function RemoveButton() {
    return (
      <button
        type="button"
        className={`absolute cursor-pointer bg-red-900 hover:bg-red-500 rounded-full h-8 w-8 text-center p-1 -right-2 -top-2 peer  `}
        onClick={() => onClick(image)}
      >
        <FontAwesomeIcon icon={faRemove} />
      </button>
    );
  }
}

export default ImageCardPreview;
