import database from "@/database/database";
import { ImageStatus } from "@/shared/Image_types";

async function save(url: string, postId: string) {
  const query =
    "INSERT INTO imagens (url, post_id, status) VALUES ($1, $2, $3) RETURNING *;";

  try {
    const result = await database.query(query, [
      url,
      postId,
      ImageStatus.PENDING,
    ]);
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
    [id],
  );

  return result;
}

async function getByPostID(id: string, status: string = ImageStatus.ACTIVE) {
  const result = await database.query(
    "select * from imagens where post_id = $1 and status = $2",
    [id, status],
  );

  return result;
}

async function updateState(id: string, status: ImageStatus) {
  const result = await database.query(
    "update imagens set status = $2 where id = $1",
    [id, status],
  );

  return result;
}

const imagem = {
  save,
  del,
  delByPostId,
  getByPostID,
  getAll,
  updateState,
};

export default imagem;
