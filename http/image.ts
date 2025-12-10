async function uploadImages(imgs: unknown) {
  await fetch("/api/v1/uploadImages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(imgs),
  });
}

const httpImage = {
  uploadImages,
};

export default httpImage;
