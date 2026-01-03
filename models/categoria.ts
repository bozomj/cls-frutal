import database from "@/database/database";
import { CategoriaDBType } from "@/shared/categoria_types";

async function save(descricao: CategoriaDBType["descricao"]) {
  const query =
    "INSERT INTO categorias (descricao) VALUES (LOWER($1)) RETURNING *;";

  try {
    const result = await database.query(query, [descricao]);
    return result;
  } catch (error) {
    const err = error as Record<string, string | number>;

    if (err!.cause.toString().includes("duplicate key"))
      throw {
        message: "Categoria já cadastrada",
        cause: error,
        http_code: 409,
      };
    throw {
      message: "erro ao inserir categoria",
      cause: error,
      http_code: 500,
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

const Categoria = {
  save,
  getAll,
};

export default Categoria;
