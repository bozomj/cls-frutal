import categoria from "@/models/categoria";

export default async function insertCategorias() {
  const categ = [
    "Eletrônicos",
    "Móveis",
    "Roupas",
    "Automóveis",
    "Imóveis",
    "Celulares",
    "Esportes",
    "Livros",
    "Serviços",
    "Animais",
  ];

  for (const c of categ) {
    await categoria.save(c);
  }
}
