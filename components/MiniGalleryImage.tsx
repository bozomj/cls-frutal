import utils from "@/utils";
import Image from "next/image";

interface MiniGalleryImageProps {
  post_imagens: unknown[];
  imgPrincipal: string;
  selectImg: (i: number) => void;
  onClick: () => void;
}

const MiniGalleryImage: React.FC<MiniGalleryImageProps> = ({
  imgPrincipal,
  post_imagens,
  selectImg,
  onClick,
}) => {
  if (!post_imagens) return <></>;
  return (
    <section
      id="lista_imagems"
      className="flex gap-1 border-3 border-gray-400 p-2 rounded-2xl w-full items-cente h-80 bg-gray-300"
    >
      <div
        id="imagem_principal"
        className="w-full cursor-pointer order-2 self-center h-full items-center flex justify-center bg-gray-50 rounded-r-2xl p-1 relative"
      >
        <Image
          alt=""
          src={utils.getUrlImageR2(imgPrincipal)}
          fill
          sizes="70"
          className="object-contain max-h-full rounded-md hover:outline-3 hover:outline-cyan-600"
          onClick={onClick}
        />
      </div>

      <div
        id="galeria"
        className="flex flex-col w-2/7 gap-2 order-1 h-full   overflow-hidden"
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
                      border-3 border-gray-100 p-1
                      hover:border-cyan-600 relative
                      `}
                key={img.id}
                onClick={() => {
                  selectImg(key);
                }}
              >
                <Image
                  className={`cursor-pointer object-contain  rounded-xl overflow-hidden `}
                  alt=""
                  src={utils.getUrlImageR2(img.url)}
                  fill
                  sizes="70"
                />
              </div>
            );
          })}
      </div>
    </section>
  );
};

export default MiniGalleryImage;
