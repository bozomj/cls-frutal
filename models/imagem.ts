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
  const result = await database.query(
    `SELECT
    p.id AS post_id,
    p.title,
    json_agg(i.*) AS lista_imagens
FROM posts p
JOIN imagens i ON i.post_id = p.id 
GROUP BY p.id, p.title;`,
  );

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
  let query = "select * from imagens where post_id = $1 and status = $2";
  let bind = [id, status];

  if (status === ImageStatus.ANY) {
    query = "select * from imagens where post_id = $1";
    bind = [id];
  }

  const result = await database.query(query, bind);

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
