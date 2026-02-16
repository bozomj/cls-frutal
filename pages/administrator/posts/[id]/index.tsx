import { GetServerSidePropsContext } from "next";

import LayoutPage from "@/layout/dashboard/layout";
import { getAdminProps } from "@/lib/hoc";

import { useEffect, useState } from "react";
import Post from "@/models/post";
import PostView from "@/components/post/PostView";

import { PostStatus } from "@/shared/post_status";
import httpPost from "@/http/post";
import OwnerGuard from "@/components/guards/OwnerGuard";
import { PostDetailType } from "@/shared/post_types";
import { UserDBType } from "@/shared/user_types";
import imagem from "@/models/imagem";
import { ImageStatus } from "@/shared/Image_types";
import httpImage from "@/http/image";
import Image from "next/image";
import utils from "@/utils";

interface Props {
  user: UserDBType;
  post: PostDetailType;
}

function PostsAdministrator({ user, post }: Props) {
  const [imagesPost, setImagesPost] = useState(post.imagens);
  const [statePost, setStatePost] = useState(post.status);

  return (
    <LayoutPage user={user}>
      <div className=" bg-gray-200  flex justify-center flex-1">
        <div className="w-[40rem] flex flex-col h-fit">
          <PostView post={post} />
          <h2>Imagens</h2>
          {imagesPost.map((img) => {
            return (
              <div
                key={img.id}
                className="flex flex-col gap-2 p-2 border-b border-gray-300"
              >
                <div className="relative h-60 w-full">
                  <Image
                    src={utils.getUrlImageR2(img.url)}
                    alt=""
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="flex justify-between items-center">
                  <span>Status: {img.status}</span>
                  <button
                    className="btn bg-red-600 text-white text-sm"
                    onClick={async () => {
                      await httpImage.updateState(
                        img.id,
                        ImageStatus.REJECTED,
                        post.id ?? "",
                      );
                      const newImagesPost = imagesPost.filter(
                        (i) => i.id !== img.id,
                      );
                      setImagesPost(newImagesPost);
                      // Lógica para remover da UI ou recarregar
                    }}
                  >
                    Reprovar Imagem
                  </button>
                </div>
              </div>
            );
          })}

          <div className="flex bg-gray-100 shadow-sm shadow-gray-400 p-4 rounded-xl justify-between items-center">
            <div>Status: {statePost}</div>{" "}
            <OwnerGuard isOwner={!(post.status === PostStatus.ACTIVE)}>
              <button
                className="btn bg-green-600 text-white font-bold"
                onClick={async () => {
                  imagesPost.forEach(async (img) => {
                    await httpImage.updateState(
                      img.id,
                      ImageStatus.ACTIVE,
                      post.id ?? "",
                    );
                  });

                  post.status = PostStatus.ACTIVE;
                  const result = await httpPost.update({
                    id: post.id || "",
                    user_id: post.user_id,
                    status: post.status,
                  });

                  setStatePost(result.status);
                }}
              >
                Aprovar
              </button>
            </OwnerGuard>
            <OwnerGuard isOwner={post.status === PostStatus.ACTIVE}>
              <button
                className="btn bg-red-600 text-white font-bold"
                onClick={async () => {
                  post.status = PostStatus.REJECTED;

                  post.imagens.forEach(async (img) => {
                    await httpImage.updateState(
                      img.id,
                      ImageStatus.REJECTED,
                      post.id ?? "",
                    );
                  });

                  const result = await httpPost.update({
                    id: post.id || "",
                    user_id: post.user_id,
                    status: post.status,
                  });

                  setStatePost(result.status);
                }}
              >
                Rejeitar
              </button>
            </OwnerGuard>
          </div>
        </div>
      </div>
    </LayoutPage>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const postid = (context.params?.id || null) as string;

  const post = await Post.getById(postid as string);
  const pendingImages = await imagem.getByPostID(postid, ImageStatus.PENDING);

  const ctx = await getAdminProps(context);

  const newCtx = {
    ...ctx,
    props: {
      ...ctx.props,
      post: {
        ...post,
        imagens: pendingImages,
        created_at: post.created_at?.toISOString(),
        updated_at: post.updated_at?.toISOString(),
      },
    },
  };

  return newCtx;
}

export default PostsAdministrator;
