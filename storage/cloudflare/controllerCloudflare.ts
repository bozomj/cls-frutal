async function save(image: File[]) {
  const form = new FormData();

  for (const img of image) {
    form.append("file", img);
  }

  const baseUrl = process.env.URLDOMAIN || "http://localhost:3000";
  const result = await fetch(baseUrl + "/api/v1/imagens/upload", {
    method: "post",
    body: form,
  });

  const img = await result.json();
  return img;
}

async function del(url: string) {
  const result = await fetch(`/api/v1/imagens/delete/`, {
    method: "delete",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url }),
  });

  const data = await result.json();
  return data;
}

const controllerCloudflare = {
  save,
  del,
};

export default controllerCloudflare;
