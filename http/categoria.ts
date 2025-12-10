import { CategoriaType } from "@/models/categoria";

async function save(categoria: CategoriaType) {
  const result = await fetch("/api/v1/categorias", {
    method: "POST",
    body: JSON.stringify(categoria),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const categoriaJson = await result.json();

  if (categoriaJson.http_code)
    return {
      http_code: categoriaJson.http_code,
      message: categoriaJson.message,
    };

  return categoriaJson[0];
}

async function getAll() {
  const categorias = await (await fetch("/api/v1/categorias")).json();
  return categorias;
}

const httpCategoria = {
  getAll,
  save,
};

export default httpCategoria;
