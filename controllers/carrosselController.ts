async function getImagesCarrossel() {
  const resp = await fetch("/api/v1/carrossel");
  const data = await resp.json();

  return data;
}

async function deleteImage(img: { url: string }) {
  const result = await fetch("/api/v1/carrossel", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(img),
  });

  return result;
}

const carrosselController = {
  getImagesCarrossel,
  deleteImage,
};

export default carrosselController;
