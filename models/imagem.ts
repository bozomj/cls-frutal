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

const imagem = {
  save,
  getAll,
};

export default imagem;
