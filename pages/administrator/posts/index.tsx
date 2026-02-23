"use client";

import { GetServerSidePropsContext } from "next";

import LayoutPage from "@/layout/dashboard/layout";
import { getAdminProps } from "@/lib/hoc";
import httpPost from "@/http/post";
import { PostStatus } from "@/shared/post_status";
import { useEffect, useState } from "react";

import utils from "@/utils";

import { statusColor } from "@/constants/statusColor";
import Link from "next/link";
import { PostDetailType } from "@/shared/post_types";
import { UserDBType } from "@/shared/user_types";

interface Props {
  user: UserDBType;
}

function PostsAdministrator({ user }: Props) {
  const [postPending, setPostPending] = useState([]);
  const [postAprovados, setPostAprovados] = useState<PostDetailType[]>([]);
  const [postRejeitados, setPostRejeitados] = useState([]);

  useEffect(() => {
    getPostsPending().then(setPostPending);
    getPostsAprovados().then(setPostAprovados);
    getPostsRejeitados().then(setPostRejeitados);
  }, []);

  return (
    <LayoutPage user={user}>
      <main className=" bg-gray-200">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2 p-2 bg-white rounded-md shadow-sm shadow-gray-400">
            <h2>Postagens aguardando aprovação</h2>
            <div className="flex flex-col gap-1">
              <ProdCard
                postagens={postPending}
                borderColor="border-yellow-600"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2 p-2 bg-white rounded-md shadow-sm shadow-gray-400">
            <h2>Postagens aprovadas</h2>
            <div className="flex flex-col gap-1">
              <ProdCard
                postagens={postAprovados}
                borderColor="border-green-700"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2 p-2 bg-white rounded-md shadow-sm shadow-gray-400">
            <h2>Postagens rejeitados</h2>
            <div className="flex flex-col gap-1">
              <ProdCard
                postagens={postRejeitados}
                borderColor="border-red-700"
              />
            </div>
          </div>
        </div>
      </main>
    </LayoutPage>
  );
}

function ProdCard({
  postagens,
  borderColor,
}: {
  postagens: PostDetailType[];
  borderColor?: string;
}) {
  return (
    <>
      {postagens.map((post: PostDetailType) => {
        return (
          <Link key={post.id} href={`/administrator/posts/${post.id}`}>
            <div
              className={`bg-white border-2 ${borderColor ?? ""} rounded-md p-2 ${
                statusColor[post.status].border
              }`}
            >
              <div className="flex gap-2 items-baseline">
                <h2 className="text-gray-800 font-bold text-lg truncate">
                  {post.title}
                </h2>
                <p className="text-xs">
                  {utils.formatarData(post?.created_at ?? "")}
                </p>
              </div>
              <p className="text-xs truncate">{post.description}</p>
            </div>
          </Link>
        );
      })}
    </>
  );
}

async function getPostsPending() {
  const result = await httpPost.getPostByStatus("0", "10", PostStatus.PENDING);
  return result;
}

async function getPostsAprovados() {
  const result = await httpPost.getPostByStatus("0", "10", PostStatus.ACTIVE);
  return result;
}

async function getPostsRejeitados() {
  const result = await httpPost.getPostByStatus("0", "10", PostStatus.REJECTED);
  return result;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return getAdminProps(context);
}

export default PostsAdministrator;
