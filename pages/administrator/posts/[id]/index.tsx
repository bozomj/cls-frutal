"use client";

import { GetServerSidePropsContext } from "next";
import { UserType } from "@/models/user";

import LayoutPage from "@/components/layout";
import { getAdminProps } from "@/lib/hoc";

import { useEffect } from "react";
import Post, { PostType } from "@/models/post";
import PostView, { PostItemType } from "@/components/post/PostView";
import { ButtonPrimary } from "@/components/Buttons";

interface Props {
  user: UserType;
  post: PostItemType;
}

function PostsAdministrator({ user, post }: Props) {
  useEffect(() => {}, []);

  return (
    <LayoutPage user={user}>
      <div className=" bg-gray-200  flex justify-center flex-1">
        <div className="w-[40rem] flex flex-col h-fit">
          <PostView post={post} />

          <div className="flex bg-gray-100 shadow-sm shadow-gray-400 p-4 rounded-xl">
            post status: {post.status}
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
