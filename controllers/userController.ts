async function getUserLogin() {
  const user = await fetch(`/api/v1/user`);
  return await user.json();
}

async function getPost(initial: number, limit: number) {
  const posts = await fetch(
    `/api/v1/posts/user?initial=${initial}&limit=${limit}`
  );
  return await posts.json();
}

async function getTotalUsers() {
  const result = await fetch("/api/v1/users/total", { method: "GET" });
  const data = await result.json();

  console.log("usuarios: ", data);
  return data.total;
}

const userController = {
  getUserLogin,
  getPost,
  getTotalUsers,
};

export default userController;
