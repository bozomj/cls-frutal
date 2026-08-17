import categoria from "@/models/categoria";

export default async function insertCategorias() {
  const categ = [
    "Outros",
    "Móveis",
    "Roupas",
    "Automóveis",
    "Imóveis",
    "Celulares",
    "Esportes",
    "Livros",
    "Serviços",
    "Animais",
    "Eletrônicos",
  ];

  for (const c of categ) {
    await categoria.save(c);
  }
}

async function run() {
  console.log("🚀 Iniciando seed de Categorias...");
  await insertCategorias();
  console.log("🏁 Processo de seed finalizado.");
  process.exit(0); // Fecha o processo do Node com sucesso
}

// 🔥 O PULO DO GATO: Só roda o script sozinho se ele for o arquivo principal no terminal
// Isso impede que ele execute e mate o Jest durante os testes (import)
// Executa a função imediatamente ao chamar o arquivo
if (
  require.main === module ||
  (process.argv[1] && process.argv[1].includes("createAdminUser"))
) {
  console.log("🚀 Iniciando seed de Administrador via terminal...");
  run().catch((err) => {
    console.error("❌ Erro fatal ao executar o seed de categorias:", err);
    process.exit(1); // Fecha o processo avisando que deu erro
  });
}
