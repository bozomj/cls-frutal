import { PostDBType, PostDetailType } from "@/shared/post_types";

async function getPostCurrentUser(initial: number, limit: number) {
  const posts = await (
    await fetch(`/api/v1/posts/user?initial=${initial}&limit=${limit}`)
  ).json();

  return posts;
}

async function getTotal(search: string | string[]) {
  const total = await (
    await fetch("api/v1/poststotal?q=" + (search || ""))
  ).json();

  return total;
}

async function getPostId(id: string) {
  const result = await fetch(`/api/v1/posts/${id}`);
  return await result.json();
}

async function getAll(
  search: string | string[],
  initial: number,
  limite: number
) {
  const posts = await (
    await fetch(
      `api/v1/posts?search=${search}&initial=${initial}&limit=${limite}`
    )
  ).json();

  return posts;
}

async function update(
  post: { id: string; user_id: string } & Partial<PostDBType>
) {
  const result = await fetch("/api/v1/posts", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(post),
  });

  const updated = await result.json();

  return updated;
}

async function savePost(post: PostDBType) {
  return await fetch("/api/v1/posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(post),
  });
}

async function delImage(img: unknown) {
  const result = await fetch(`/api/v1/imagens`, {
    method: "delete",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(img),
  });

  const resultBody = await result.json();
  console.log(resultBody);
}

async function deletePost(id: string) {
  await fetch(`api/v1/posts/${id}`, {
    method: "DELETE",
  });
}

async function getPostByStatus(
  initial: string,
  limite: string,
  status: string
) {
  const result = await fetch(
    `/api/v1/administrator/posts?status=${status}&initial=${initial}&limit=${limite}`
  );
  const resultBody = await result.json();
  return resultBody;
}

const httpPost = {
  getPostCurrentUser,
  getTotal,
  getPostId,
  getAll,
  getPostByStatus,
  savePost,
  update,
  delImage,
  deletePost,
};

export default httpPost;
