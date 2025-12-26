import utils from "@/utils";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useEffect, useState } from "react";

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
          bg-cyan-950/80 
          justify-center items-center px-1 ${visible ? "flex" : "hidden"}
        `}
      onClick={() => {
        onClose(imagemIndex);
      }}
    >
      <div className="flex h-full w-full relative">
        <button
          className="h-full flex-1 w-[10%] text-5xl absolute left-0 z-[6] cursor-pointer text-white/30 outline-0 hover:text-white/50 md:text-8xl "
          onClick={(e) => {
            e.stopPropagation();
            moveLeft();
          }}
        >
          <FontAwesomeIcon icon={faAngleLeft} />
        </button>

        <div className="h-full relative flex-4">
          <Image
            className="flex-1"
            src={utils.getUrlImageR2(images[imagemIndex]?.url) || ""}
            alt=""
            fill
            sizes="100"
            style={{ objectFit: "contain" }}
          />
        </div>
        <button
          className=" h-full  w-[10%] flex-1 text-5xl absolute z-[6] right-0 cursor-pointer text-white/30 outline-0 hover:text-white/50 md:text-8xl"
          onClick={(e) => {
            e.stopPropagation();
            moveRight();
          }}
        >
          <FontAwesomeIcon icon={faAngleRight} />
        </button>
      </div>
    </div>
  );
};

export default FullImageView;
