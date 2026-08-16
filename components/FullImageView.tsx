import utils from "@/utils";
import {
  faAngleLeft,
  faAngleRight,
  faClose,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import OwnerGuard from "./guards/OwnerGuard";
import { ImageDBType } from "@/shared/Image_types";

interface FullImageViewProps {
  images: ImageDBType[];
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
    if (imagemIndex > 0) setImagemIndex(imagemIndex - 1);
  }

  function moveRight() {
    if (imagemIndex < images.length - 1) setImagemIndex(imagemIndex + 1);
  }
  const keyHandler = (e: KeyboardEvent) => {
    const key = e.key as keyof typeof moves;
    if (key in moves) moves[key]();
  };

  useEffect(() => {
    window.addEventListener("keydown", keyHandler);

    return () => {
      window.removeEventListener("keydown", keyHandler);
    };
  }, [imagemIndex]);

  useEffect(() => {
    setImagemIndex(index);
  }, [index]);

  return images.length < 1 ? (
    <></>
  ) : (
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
      <div className="flex h-full w-full items-center touch-none relative">
        <OwnerGuard isOwner={imagemIndex > 0}>
          <ArrowButton
            variant="left"
            onClick={(e) => {
              e.stopPropagation();
              moveLeft();
            }}
          />
        </OwnerGuard>

        <Image
          className="absolute w-full h-fit max-h-full "
          src={utils.getUrlImageR2(images[imagemIndex]?.url) || ""}
          alt=""
          fill
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

        <OwnerGuard isOwner={imagemIndex < images.length - 1}>
          <ArrowButton
            variant="right"
            onClick={(e) => {
              e.stopPropagation();
              moveRight();
            }}
          />
        </OwnerGuard>
      </div>
    </div>
  );
};

type ArrowButtonProps = {
  onClick: (e: any) => void;
  variant: "left" | "right";
};

function ArrowButton({ onClick, variant }: ArrowButtonProps) {
  const arrow = {
    left: <FontAwesomeIcon icon={faAngleLeft} />,
    right: <FontAwesomeIcon icon={faAngleRight} />,
    position: {
      left: "left-0",
      right: "right-0",
    },
  };

  return (
    <button
      className={`h-fit rounded-full border-white/30 flex-1 w-[10%] text-5xl absolute z-[6] cursor-pointer text-white/50 outline-0 hover:text-white/80 md:text-8xl hover:border-2 transition duration-300 hover:bg-white/10  ${arrow.position[variant]}`}
      onClick={(e) => onClick(e)}
    >
      {arrow[variant]}
    </button>
  );
}

export default FullImageView;
