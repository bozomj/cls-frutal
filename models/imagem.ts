import database from "@/database/database";

async function save(url: string, postId: string) {
  const query =
    "INSERT INTO imagens (url, post_id) VALUES ($1, $2) RETURNING *;";

  try {
    const result = await database.query(query, [url, postId]);
    return result;
  } catch (error: unknown) {
    throw {
      message: "erro ao inserir imagem",
      cause: error,
    };
  }
}

async function getAll() {
  const result = await database.query("select * from imagens");

  return result;
}

async function del(id: string) {
  const result = await database.query("delete from imagens where id = $1", [
    id,
  ]);
  return result;
}

async function delByPostId(id: string) {
  const result = await database.query(
    "delete from imagens where post_id = $1",
    [id]
  );

  return result;
}

async function getByPostID(id: string) {
  const result = await database.query(
    "select * from imagens where post_id = $1",
    [id]
  );
  return result;
}

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

const imagem = {
  save,
  del,
  delByPostId,
  getAll,
  getByPostID,
  saveProfileImage,
  getImagesProfile,
};

export default imagem;
