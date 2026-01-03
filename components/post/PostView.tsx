import utils from "@/utils";
import CapitalizeText from "../CapitalizeText";
import CircleAvatar from "../CircleAvatar";
import MiniGalleryImage from "../MiniGalleryImage";
import { useState } from "react";
import { useBackdrop } from "@/ui/backdrop/useBackdrop";
import FullImageView from "../FullImageView";
import { PostDetailType } from "@/shared/post_types";

export type PostItemType = {
  id: string;
  title: string;
  valor: string;
  created_at: string;
  imagens: { url: string }[];
  description: string;
  name: string;
  phone: string;
  user_id: string;
  updated_at: string;
  img_profile: string;
  maxImagens: number;
  status: string;
};

interface PostViewProps {
  post: PostDetailType;
}

export default function PostView({ post }: PostViewProps) {
  const post_imagens = post.imagens;
  const [imgPrincial, setImgPrincipal] = useState<string>();
  const [imagemIndex, setImagemIndex] = useState<number>(0);

  const usebackdrop = useBackdrop();

  return (
    <article className="flex flex-auto flex-col gap-2 h-full max-w-[40rem] p-4 bg-gray-100 rounded-2xl shadow-sm shadow-gray-400 my-2">
      <PostHeader />

      <div>
        <section className="bg-gray-200 rounded-2xl flex-auto p-2">
          <MiniGalleryImage
            post_imagens={post_imagens}
            imgPrincipal={imgPrincial as string}
            onClick={() =>
              usebackdrop.openContent(
                <FullImageView
                  images={post_imagens}
                  index={imagemIndex}
                  visible={true}
                  onClose={closeFullImages}
                />
              )
            }
            selectImg={(i) => {
              setImgPrincipal(post_imagens[i].url as string);
              setImagemIndex(i);
            }}
          />
          <ItemTitle />
          <div className=" flex justify-between items-baseline ">
            <ItemValor />
          </div>
          <ItemDescription />
        </section>
      </div>
    </article>
  );

  function PostHeader() {
    return (
      <header className="flex gap-2  items-center">
        <CircleAvatar imagem={imageUrl(post.img_profile)} size={2} />
        <CapitalizeText txt={post.name} />

        <span className="text-xs ml-auto">
          Publicado {utils.formatarData(post.created_at ?? "")}
        </span>
      </header>
    );
  }

  function imageUrl(url: string | null) {
    return utils.getUrlImageR2(url);
  }

  function closeFullImages(i: number) {
    setImagemIndex(() => {
      setImgPrincipal(post_imagens[i]?.url);
      return i;
    });
    usebackdrop.closeContent();
  }

  function ItemTitle() {
    return (
      <div className="flex  gap-2 items-center  font-bold w-full mt-2">
        <h1 className="focus:outline-2 text-xl  focus:outline-gray-400 text-gray-800 ">
          {post.title}
        </h1>
      </div>
    );
  }

  function ItemValor() {
    return (
      <div className="font-bold text-green-700 flex gap-2">
        <p>
          R$:
          <span className="p-2 focus:outline-gray-400 focus:outline-2 text-xl ">
            {post.valor}
          </span>
        </p>
      </div>
    );
  }

  function ItemDescription() {
    return (
      <div className="">
        <div className="flex items-center gap-2">
          <h2 className="text-gray-500">Sobre este item</h2>
        </div>
        <p className="focus:outline-2 focus:outline-gray-400 text-gray-700">
          {post.description}
        </p>
      </div>
    );
  }
}
