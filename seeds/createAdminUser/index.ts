import "dotenv/config";
import User from "@/models/user";

export default async function createAminUser() {
  const user = {
    name: process.env.USERMASTER_NAME || "",
    email: process.env.USERMASTER_EMAIL || "",
    password: process.env.USERMASTER_PASSWORD || "",
    phone: "34997668902",
    is_admin: true,
  };

  try {
    const us = await User.create(user);
    await User.setFeatures(us[0].id, ["create:session"]);
    console.log("✅ Usuário Administrador criado com sucesso!");
  } catch (error) {
    console.log(">>>>>| ", error);
    return error;
  }
}
async function run() {
  console.log("🚀 Iniciando seed de AdminUser...");
  await createAminUser();
  console.log("🏁 Processo de seed finalizado.");
  process.exit(0); // Fecha o processo do Node com sucesso
}

// 2. O PULO DO GATO: Função autoexecutável para quando o script rodar via terminal
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
