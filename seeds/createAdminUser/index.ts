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
    await User.create(user);
    console.log("✅ Usuário Administrador criado com sucesso!");
  } catch (error) {
    return error;
  }
}

// 2. O PULO DO GATO: Função autoexecutável para quando o script rodar via terminal
async function run() {
  console.log("🚀 Iniciando seed de Administrador...");
  await createAminUser();
  console.log("🏁 Processo de seed finalizado.");
  process.exit(0); // Fecha o processo do Node com sucesso
}

// Executa a função imediatamente ao chamar o arquivo
run().catch((err) => {
  console.error("❌ Erro fatal ao executar o seed de admin:", err);
  process.exit(1); // Fecha o processo avisando que deu erro
});
