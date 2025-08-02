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

    const ct = await result.json();

    if (ct.http_code)
      return {
        http_code: ct.http_code,
        message: ct.message,
      };

    return ct[0];
  },
};

export default categoriaController;
