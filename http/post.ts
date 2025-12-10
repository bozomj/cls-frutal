async function getPostCurrentUser(initial: number, limit: number) {
  const posts = await fetch(
    `/api/v1/posts/user?initial=${initial}&limit=${limit}`
  );
  return await posts.json();
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

async function update(post: unknown) {
  const result = await fetch("/api/v1/posts", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(post),
  });

  const updated = await result.json();

  return updated;
}

async function delImage(img: unknown) {
  fetch(`/api/v1/imagens`, {
    method: "delete",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(img),
  });
}

const httpPost = {
  getPostCurrentUser,
  getTotal,
  getPostId,
  getAll,
  update,
  delImage,
};

export default httpPost;
