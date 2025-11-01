import utils from "@/utils";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
      <button
        className="h-full text-9xl cursor-pointer text-white/30 outline-0 hover:text-white/50"
        onClick={(e) => {
          e.stopPropagation();
          moveLeft();
        }}
      >
        <FontAwesomeIcon icon={faAngleLeft} />
      </button>
      {/* <div className="flex flex-col bg-red gap-2 order-1 h-full justify-center w-full overflow-hidden"> */}
      <div className="h-full flex">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          tabIndex={0}
          src={utils.getUrlImage(images[imagemIndex].url)}
          alt=""
          className={`cursor-pointer object-contain max-h-full w-full `}
          // className=" flex-1 rounded  object-contain shadow-2xl shadow-black outline-3 outline-cyan-600"
        />
      </div>
      <button
        className=" h-full text-9xl cursor-pointer text-white/30 outline-0 hover:text-white/50"
        onClick={(e) => {
          e.stopPropagation();
          moveRight();
        }}
      >
        <FontAwesomeIcon icon={faAngleRight} />
      </button>
    </div>
  );
};

export default FullImageView;
