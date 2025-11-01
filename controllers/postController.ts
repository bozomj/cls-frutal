async function getTotal(search: string | string[]) {
  const total = await (
    await fetch("api/v1/poststotal?q=" + (search || ""))
  ).json();

  return total;
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

const postController = {
  getTotal,
  getAll,
};

export default postController;
