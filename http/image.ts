async function uploadImages(imgs: unknown) {
  await fetch("/api/v1/uploadImages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(imgs),
  });
}

async function updateState(id: string | null, status: string, post_id: string) {
  if (id === null) return;

  const result = await fetch("/api/v1/imagens", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id, status, post_id }),
  });

  const resultBody = await result.json();
  return resultBody;
}

async function getAllImagesPost() {
  try {
    const result = await fetch("/api/v1/imagens");
    return await result.json();
  } catch (error) {
    return { error };
  }
}

const httpImage = {
  uploadImages,
  getAllImagesPost,
  updateState,
};

export default httpImage;
