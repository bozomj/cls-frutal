async function getUserLogin() {
  const user = await fetch(`/api/v1/user`);
  return await user.json();
}

async function getTotalUsers() {
  const result = await fetch("/api/v1/users/total");
  const data = await result.json();

  return data.total;
}

const httpUser = {
  getUserLogin,
  getTotalUsers,
};

export default httpUser;
