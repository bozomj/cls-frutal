import utils from "@/utils";
import Image from "next/image";
import VerticalDivider from "./VerticalDivider";

interface MiniGalleryImageProps {
  post_imagens: unknown[];
  imgPrincipal: string;
  className?: string;
  selectImg: (i: number) => void;
  onClick: () => void;
}

const MiniGalleryImage: React.FC<MiniGalleryImageProps> = ({
  imgPrincipal,
  post_imagens,
  className,
  selectImg,
  onClick,
}) => {
  if (!post_imagens) return <></>;
  return (
    <section
      id="lista_imagems"
      className={`flex gap-1 w-full items-cente h-80  ${className} `}
    >
      <div
        id="imagem_principal"
        className="w-full cursor-pointer order-2 
        self-center h-full items-center  flex justify-center
         border-gray-100     overflow-hidden hover:border-cyan-600 relative border-2"
      >
        <Image
          alt=""
          src={utils.getUrlImageR2(imgPrincipal)}
          fill
          sizes="70"
          className={`cursor-zoom-in bg-gray-100 object-contain  rounded-r-xl overflow-hidden `}
          onClick={onClick}
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
                className={`flex-1 justify-center w-full bg-gray-50  shrink h-1/3 ${rounded} overflow-hidden  max-h-1/3 
                      
                      hover:border-cyan-600 relative
                      `}
                key={img.id}
                onClick={() => {
                  selectImg(key);
                }}
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
};

export default MiniGalleryImage;
