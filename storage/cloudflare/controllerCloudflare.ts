async function save(image: File[]) {
  const form = new FormData();

  for (const img of image) {
    form.append("file", img);
  }

  const result = await fetch("/api/v1/imagens/upload", {
    method: "post",
    body: form,
  });

  const img = await result.json();
  return img;
}

const controllerCloudflare = {
  save,
};

export default controllerCloudflare;
