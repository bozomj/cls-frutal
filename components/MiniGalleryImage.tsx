import { ImageDBType } from "@/shared/Image_types";
import { useBackdrop } from "@/ui/backdrop/useBackdrop";
import utils from "@/utils";
import Image from "next/image";
import { useState } from "react";
import FullImageView from "./FullImageView";

interface MiniGalleryImageProps {
  post_imagens: ImageDBType[];
  className?: string;
}

const MiniGalleryImage: React.FC<MiniGalleryImageProps> = ({
  post_imagens,
  className,
}) => {
  const [imagemIndex, setImagemIndex] = useState<number>(0);
  const [imgPrincipal, setImagePrincipal] = useState(
    post_imagens[imagemIndex] ?? {},
  );
  const usebackdrop = useBackdrop();

  return (
    <section
      id="lista_imagems"
      className={`flex gap-1 w-full items-cente h-80  ${className} `}
    >
      <div
        id="imagem_principal"
        className="w-full cursor-pointer order-2 
        self-center h-full items-center  flex justify-center
         border-gray-300 overflow-hidden hover:border-cyan-600 rounded-r-xl relative border-2 "
      >
        <Image
          alt=""
          src={utils.getUrlImageR2(imgPrincipal.url ?? "")}
          fill
          sizes="70"
          className={`cursor-zoom-in bg-gray-200  object-contain   overflow-hidden `}
          onClick={openFullImage}
        />
      </div>

      <div
        id="galeria"
        className="flex flex-col w-2/7 gap-2 order-1 h-full overflow-hidden
        "
      >
        {post_imagens.length > 0 &&
          post_imagens.map((im, key) => {
            const img = im as { id: string; url: string };
            if (img == null) return;
            const rounded =
              key == 0
                ? " rounded-tl-2xl"
                : key < post_imagens.length - 1
                  ? "rounded-sm"
                  : "rounded-bl-2xl";

            return (
              <div
                className={`flex-1 justify-center w-full bg-gray-50  shrink h-1/3 ${rounded} overflow-hidden  max-h-1/3 hover:border-cyan-600 relative `}
                key={img.id}
                onClick={() => selectImg(key)}
              >
                <Image
                  className={`cursor-pointer object-cover   overflow-hidden
                     w-full bg-gray-50  h-full ${rounded} overflow-hidden   
                      border-2 border-gray-400
                      hover:border-cyan-600 relative
                    `}
                  alt=""
                  src={utils.getUrlImageR2(img.url)}
                  fill
                  sizes="70"
                  loading="eager"
                />
              </div>
            );
          })}
      </div>
    </section>
  );

  function selectImg(index: number) {
    setImagemIndex(index);
    setImagePrincipal(post_imagens[index]);
  }

  function openFullImage() {
    if (imgPrincipal) {
      usebackdrop.openContent(
        <FullImageView
          images={post_imagens}
          index={imagemIndex}
          visible={true}
          onClose={closeFullImages}
        />,
      );
    }
  }

  function closeFullImages(i: number) {
    setImagemIndex(() => {
      setImagePrincipal(post_imagens[i]);
      return i;
    });
    usebackdrop.closeContent();
  }
};

export default MiniGalleryImage;
