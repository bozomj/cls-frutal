async function uploadImages(imgs: unknown) {
  await fetch("/api/v1/uploadImages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(imgs),
  });
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
};

export default httpImage;
