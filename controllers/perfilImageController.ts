import { imageProfileType } from "@/models/perfil_images";

async function del(img: imageProfileType) {
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

const PerfilImageController = {
  del,
};

export default PerfilImageController;
