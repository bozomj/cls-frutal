import database from "@/database/database";

export type ImageType = { id: string; file: File; url: string };

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

const imagem = {
  save,
  del,
  delByPostId,
  getAll,
  getByPostID,
};

export default imagem;
