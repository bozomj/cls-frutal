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

async function updateImageProfile(img: unknown) {
  const resutl = await fetch("/api/v1/user/setImageProfile", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(img),
  });

  return await resutl.json();
}

import { imageProfileType } from "@/models/perfil_images";

async function deleteImageProfile(img: imageProfileType) {
  const result = await fetch("/api/v1/user/setImageProfile", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(img),
  });

  const deleted = await result.json();
  return deleted;
}

const httpPerfilImages = {
  updateImageProfile,
  saveImageProfile,
  deleteImageProfile,
};

export default httpPerfilImages;
