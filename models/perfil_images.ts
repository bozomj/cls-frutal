import database from "@/database/database";

async function saveProfileImage(img: Record<string, unknown>) {
  console.log("imagem", img.url);
  try {
    await database.query(
      `
      UPDATE perfil_images
        SET selected = false
        WHERE user_id = $1;
      `,
      [img.user_id]
    );

    const result = await database.query(
      `
      insert into perfil_images (user_id, url, selected) values ($1, $2, $3) returning *;
      `,
      [img.user_id, img.url, true]
    );
    return result;
  } catch (error) {
    throw {
      message: "erro ao salvar",
      cause: error,
    };
  }
}

async function getImagesProfile(id: string) {
  const query = `
  SELECT * FROM perfil_images WHERE user_id = $1
  `;

  const result = await database.query(query, [id]);
  return result;
}

const profileImages = {
  getImagesProfile,
  saveProfileImage,
};

export default profileImages;
