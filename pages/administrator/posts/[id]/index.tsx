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
import { ImageDBType, ImageStatus } from "@/shared/Image_types";
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
      <div className=" bg-gray-200   flex justify-center flex-1">
        <div className="w-7xl flex flex-col h-fit gap-2">
          <PostView post={post} />

          <section className="bg-gray-50 rounded-xl shadow-sm shadow-gray-400">
            <h2 className="px-2 pt-2 font-black">Fotos do anuncio</h2>
            <p className="px-2 pb-2 text-xs text-slate-400">
              Gerencie o catálogo de fotos
            </p>
            <div className="flex justify-center bg-gray-100">
              {imagesPost.map((img, i) => {
                return (
                  <div
                    key={img.id}
                    className="flex flex-col w-1/3 md:w-1/4 lg:w-1/6  gap-1 m-2 border-2 p-3 border-b border-slate-400 bg-gray-50 rounded-xl  "
                  >
                    <div className="relative  h-full w-full ">
                      <Image
                        src={utils.getUrlImageR2(img.url)}
                        alt=""
                        width={500}
                        height={500}
                        className="object-cover rounded-xl h-full "
                      />
                    </div>

                    <div className="flex justify-between items-center">
                      {/* <span>Status: {img.status}</span> */}
                      <button
                        className="btn bg-red-800 hover:bg-red-700 transition duration-500 text-white text-sm w-full"
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
                        Reprovar
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
          <div className="flex  bg-gray-100 shadow-sm shadow-gray-400 p-4 rounded-xl justify-between items-center">
            <div
              className={
                statePost === PostStatus.ACTIVE
                  ? "text-green-900 "
                  : "text-accent " + "font-black"
              }
            >
              Status: {statePost}
            </div>
            <div className="flex gap-2">
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
                  className="btn bg-red-800 hover:bg-red-700 transition duration-500 text-white font-bold"
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

              <OwnerGuard isOwner={post.status !== PostStatus.PENDING}>
                <button
                  className="btn bg-red-400 text-white font-bold"
                  onClick={async () => {
                    post.status = PostStatus.PENDING;

                    post.imagens.forEach(async (img) => {
                      await httpImage.updateState(
                        img.id,
                        post.status,
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
                  Pendente
                </button>
              </OwnerGuard>
            </div>
          </div>
        </div>
      </div>
    </LayoutPage>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const postid = (context.params?.id || null) as string;

  const post = await Post.getById(postid as string);
  const pendingImages = await imagem.getByPostID(postid, ImageStatus.ANY);

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
        expires_at: post.expires_at?.toISOString(),
      },
    },
  };

  return newCtx;
}

export default PostsAdministrator;
