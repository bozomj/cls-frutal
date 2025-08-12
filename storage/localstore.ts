function setUser(user: unknown) {
  localStorage.setItem("user", JSON.stringify(user));
}

function getUser() {
  const user = localStorage!.getItem("user");
  return user ? JSON.parse(user) : null;
}

const localstore = {
  setUser,
  getUser,
};

export default localstore;
