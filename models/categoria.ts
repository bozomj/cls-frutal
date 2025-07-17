import database from "@/database/database";

export type CategoriaType = {
  id: number;
  descricao: string;
};

async function save(descricao: CategoriaType["descricao"]) {
  const query =
    "INSERT INTO categorias (descricao) VALUES (LOWER($1)) RETURNING *;";

  try {
    const result = await database.query(query, [descricao]);
    return result;
  } catch (error: unknown) {
    throw {
      message: "erro ao inserir categoria",
      cause: error,
    };
  }
}

async function getAll() {
  const query = "SELECT * FROM categorias ORDER BY descricao";

  try {
    const result = await database.query(query);
    return result;
  } catch (error: unknown) {
    throw {
      message: "erro ao listar categorias",
      cause: error,
    };
  }
}

const categoria = {
  save,
  getAll,
};

export default categoria;
