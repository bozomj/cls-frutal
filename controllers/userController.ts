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

async function updateImageProfile(img: unknown) {
  const resutl = await fetch("/api/v1/user/setImageProfile", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(img),
  });

  return await resutl.json();
}

const userController = {
  getUserLogin,
  getPost,
  getTotalUsers,
  updateImageProfile,
};

export default userController;
