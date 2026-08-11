import utils from "@/utils";
import {
  faAngleLeft,
  faAngleRight,
  faClose,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useEffect, useState } from "react";
import OwnerGuard from "./guards/OwnerGuard";

interface FullImageViewProps {
  images: { url: string }[];
  index: number;
  visible: boolean;
  onClose: (i: number) => void;
}

const FullImageView: React.FC<FullImageViewProps> = ({
  images,
  index,
  visible,
  onClose,
}: FullImageViewProps) => {
  const [imagemIndex, setImagemIndex] = useState<number>(index);

  const moves = {
    ArrowLeft: moveLeft,
    ArrowRight: moveRight,
    Escape: () => onClose(imagemIndex),
  };

  function moveLeft() {
    let v = imagemIndex;
    if (imagemIndex > 0) v = imagemIndex - 1;
    setImagemIndex(v);
  }

  function moveRight() {
    let v = imagemIndex;
    if (imagemIndex < images.length - 1) v = imagemIndex + 1;
    setImagemIndex(v);
  }

  useEffect(() => {
    const keyHandler = (e: KeyboardEvent) => {
      const key = e.key as keyof typeof moves;
      const img = document
        .getElementById("imgfull")
        ?.classList.contains("flex");
      if (img && key in moves) moves[key]();
    };

    window.addEventListener("keydown", keyHandler);

    return () => window.removeEventListener("keydown", keyHandler);
  });

  useEffect(() => {
    setImagemIndex(index);
  }, [index]);

  if (images.length < 1) return <></>;

  return (
    <div
      id="imgfull"
      className={`
          absolute top-0 z-[5] left-0 h-full w-full p-2 
          bg-gray-800/80 
          justify-center items-center px-1 ${visible ? "flex" : "hidden"}
        `}
      onClick={() => {
        onClose(imagemIndex);
      }}
    >
      <div className="flex h-full w-full relative items-center">
        <OwnerGuard isOwner={imagemIndex > 0}>
          <button
            className="h-full flex-1 w-[10%] text-5xl absolute left-0 z-[6] cursor-pointer text-white/30 outline-0 hover:text-white/80 md:text-8xl "
            onClick={(e) => {
              e.stopPropagation();
              moveLeft();
            }}
          >
            <FontAwesomeIcon icon={faAngleLeft} />
          </button>
        </OwnerGuard>

        <div className="h-fit flex-1 relative max-h-full shadow-sm shadow-gray-900 touch-none ">
          <Image
            className="bg-blue-400 h-fit  block w-full "
            src={utils.getUrlImageR2(images[imagemIndex]?.url) || ""}
            alt=""
            height={500}
            width={500}
            sizes="100"
            style={{ objectFit: "contain" }}
            onClick={(e) => e.stopPropagation()}
          />
          <button
            className="absolute cursor-pointer right-2 z-[7] top-2 border-2 w-8 h-8 rounded-full flex justify-center items-center transition duration-300 bg-red-500/50 hover:bg-red-800 hover:border-red-400 shadow-sm shadow-gray-900 "
            onClick={() => onClose(imagemIndex)}
          >
            <FontAwesomeIcon icon={faClose} className="" />
          </button>
        </div>

        <OwnerGuard isOwner={imagemIndex < images.length - 1}>
          <button
            className=" h-full  w-[10%] flex-1 text-5xl absolute z-[6] right-0 cursor-pointer text-white/30 outline-0 hover:text-white/80 md:text-8xl"
            onClick={(e) => {
              e.stopPropagation();
              moveRight();
              console.log(imagemIndex, images.length);
            }}
          >
            <FontAwesomeIcon icon={faAngleRight} />
          </button>
        </OwnerGuard>
      </div>
    </div>
  );
};

export default FullImageView;
