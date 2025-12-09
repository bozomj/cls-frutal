import database from "@/database/database";

export type imageProfileType = {
  id: number;
  url: string;
  file: File;
  selected: boolean;
};

async function saveProfileImage(img: Record<string, unknown>) {
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
async function update(img: Record<string, unknown>) {
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
      UPDATE perfil_images
        SET selected = true
        WHERE id = $1;
      `,
      [img.id]
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
  SELECT * FROM perfil_images WHERE user_id = $1;
  `;

  const result = await database.query(query, [id]);
  return result;
}

async function del(id: string) {
  const query = `delete from perfil_images where id = $1`;

  const result = await database.query(query, [id]);
  return result;
}

const profileImages = {
  getImagesProfile,
  saveProfileImage,
  update,
  del,
};

export default profileImages;
