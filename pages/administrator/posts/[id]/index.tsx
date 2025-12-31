"use client";

import { GetServerSidePropsContext } from "next";
import { UserType } from "@/models/user";

import LayoutPage from "@/components/layout";
import { getAdminProps } from "@/lib/hoc";

import { useEffect, useState } from "react";
import Post from "@/models/post";
import PostView, { PostItemType } from "@/components/post/PostView";

import { PostStatus } from "@/shared/post_status";
import httpPost from "@/http/post";
import OwnerGuard from "@/components/guards/OwnerGuard";

interface Props {
  user: UserType;
  post: PostItemType;
}

function PostsAdministrator({ user, post }: Props) {
  const [statePost, setStatePost] = useState(post.status);
  useEffect(() => {}, []);

  return (
    <LayoutPage user={user}>
      <div className=" bg-gray-200  flex justify-center flex-1">
        <div className="w-[40rem] flex flex-col h-fit">
          <PostView post={post} />

          <div className="flex bg-gray-100 shadow-sm shadow-gray-400 p-4 rounded-xl justify-between items-center">
            <div>Status: {statePost}</div>{" "}
            <OwnerGuard isOwner={post.status === PostStatus.ACTIVE}>
              <button
                className="btn bg-green-600 text-white font-bold"
                // disabled={post.status === PostStatus.ACTIVE}
                onClick={
                  !(post.status === PostStatus.ACTIVE)
                    ? () => {}
                    : async () => {
                        post.status = PostStatus.ACTIVE;
                        const result = await httpPost.update({
                          id: post.id,
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
  const postid = context.params?.id || null;

  const post = await Post.getById(postid as string);

  const ctx = await getAdminProps(context);

  const newCtx = {
    ...ctx,
    props: {
      ...ctx.props,
      post: {
        ...post,
        created_at: post.created_at?.toISOString(),
        updated_at: post.updated_at?.toISOString(),
      },
    },
  };

  return newCtx;
}

export default PostsAdministrator;
