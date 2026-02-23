async function getUserLogin() {
  const user = await fetch(`/api/v1/user`);
  return await user.json();
}

async function getTotalUsers() {
  const result = await fetch("/api/v1/users/total");
  const data = await result.json();

  return data.total;
}

async function create(user: unknown) {
  const result = await fetch("/api/v1/user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });
  return result;
}

async function total() {
  const result = await fetch("/api/v1/users/total");
  return await result.json();
}

const httpUser = {
  create,
  getUserLogin,
  getTotalUsers,
  total,
};

export default httpUser;
