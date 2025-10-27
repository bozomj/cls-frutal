import database from "@/database/database";

export type CategoriaType = {
  id?: number;
  url: string;
  created_at?: string;
};

async function getAll() {
  const query = "SELECT * FROM carrossel_images;";

  try {
    const result = await database.query(query);

    return result;
  } catch (error) {
    console.log("Erro ao buscar imagens do carrossel:", error);
    return [];
  }
}

async function save(url: string) {
  const query = `INSERT INTO carrossel_images (url) VALUES ($1) RETURNING *;`;
  const values = [url];

  try {
    const result = await database.query(query, values);
    return result;
  } catch (error) {
    console.log("Erro ao salvar imagem do carrossel:", error);
    return [];
  }
}

const carrosselImages = {
  save,
  getAll,
};

export default carrosselImages;
