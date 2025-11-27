async function saveImageProfile(dataImage: {
  user_id: string | undefined;
  url: string;
}) {
  await fetch("/api/v1/user/setImageProfile", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dataImage),
  });
}

const controllerPostgres = {
  saveImageProfile,
};

export default controllerPostgres;
