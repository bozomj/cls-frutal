import utils from "@/utils";

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
  return (
    <section
      id="lista_imagems"
      className="flex gap-1 border-3 border-gray-400 p-2 rounded-2xl w-full items-cente h-[25rem]"
    >
      <div
        id="imagem_principal"
        className="w-full cursor-pointer order-2 self-center h-full items-center flex justify-center bg-gray-100 rounded-r-2xl p-1"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className=" max-h-full rounded-md hover:outline-3 hover:outline-cyan-600"
          tabIndex={1}
          src={utils.getUrlImage(imgPrincipal)}
          alt=""
          onClick={() => {
            onClick();
          }}
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
                className={`flex flex-1 justify-center w-full bg-gray-100  shrink h-1/3 ${rounded} overflow-hidden  max-h-1/3 relative
                      border-3 border-gray-100 p-1
                      hover:border-cyan-600 
                      `}
                key={img.id}
                onClick={() => {
                  console.log(key);
                  selectImg(key);
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
                <img
                  className={`cursor-pointer object-contain rounded-md`}
                  src={utils.getUrlImage(img.url)}
                />
              </div>
            );
          })}
      </div>
    </section>
  );
};

export default MiniGalleryImage;
