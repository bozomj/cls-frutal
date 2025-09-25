import { CategoriaType } from "@/models/categoria";

const categoriaController = {
  async save(categoria: CategoriaType) {
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
  },
};

export default categoriaController;
