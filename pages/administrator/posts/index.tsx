import { GetServerSidePropsContext } from "next";
import { UserType } from "@/models/user";

import LayoutPage from "@/components/layout";
import { getAdminProps } from "@/lib/hoc";
import httpPost from "@/http/post";
import { PostStatus } from "@/shared/post_status";
import { useEffect, useState } from "react";
import ListTile from "@/components/ListTile";
import { PostType } from "@/models/post";
import utils from "@/utils";

interface Props {
  user: UserType;
}

function PostsAdministrator({ user }: Props) {
  const [postPending, setPostPending] = useState([]);

  useEffect(() => {
    getPostsPending().then((e) => setPostPending(e));
  }, []);

  return (
    <LayoutPage user={user}>
      <div className="">
        {postPending.map((post: PostType) => {
          return (
            <div key={post.id}>
              <div className="flex gap-2 items-baseline">
                <p className="font-bold text-lg truncate">{post.title}</p>
                <p className="text-xs">
                  {utils.formatarData(post?.created_at ?? "")}
                </p>
              </div>
              <p className="text-xs truncate">{post.description}</p>
            </div>
          );
        })}
      </div>
    </LayoutPage>
  );
}

async function getPostsPending() {
  const result = await httpPost.getPostByStatus("0", "10", PostStatus.PENDING);
  return result;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return getAdminProps(context);
}

export default PostsAdministrator;
