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

interface Props {
  user: UserDBType;
  post: PostDetailType;
}

function PostsAdministrator({ user, post }: Props) {
  const [statePost, setStatePost] = useState(post.status);
  console.log(post);
  useEffect(() => {}, []);

  return (
    <LayoutPage user={user}>
      <div className=" bg-gray-200  flex justify-center flex-1">
        <div className="w-[40rem] flex flex-col h-fit">
          <PostView post={post} />

          <div className="flex bg-gray-100 shadow-sm shadow-gray-400 p-4 rounded-xl justify-between items-center">
            <div>Status: {statePost}</div>{" "}
            <OwnerGuard isOwner={!(post.status === PostStatus.ACTIVE)}>
              <button
                className="btn bg-green-600 text-white font-bold"
                onClick={
                  post.status === PostStatus.ACTIVE
                    ? () => {}
                    : async () => {
                        post.imagens.forEach(async (img) => {
                          await httpImage.updateState(
                            img.id,
                            ImageStatus.ACTIVE,
                          );
                        });

                        post.status = PostStatus.ACTIVE;
                        const result = await httpPost.update({
                          id: post.id || "",
                          user_id: post.user_id,
                          status: post.status,
                        });

                        setStatePost(result.status);
                      }
                }
              >
                Aprovar
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
