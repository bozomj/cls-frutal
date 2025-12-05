import database from "@/database/database";
import path from "path";
import profileImages from "@/models/perfil_images";

beforeAll(async () => {
  await database.query("delete from perfil_images");
});

describe("teste imagem profile", () => {
  it("erro ao salvar imagem de usuario com id incorreto", async () => {
    const userId = "a5240bf7-a135-4dfc-92eb-129edea16568";

    const caminho = path.join("public", "img", "logo2.svg");

    const img = { user_id: userId, url: caminho };

    try {
      await profileImages.saveProfileImage(img);
    } catch (error) {
      expect(error).toMatchObject({
        message: "erro ao salvar",
        cause: expect.anything(), // ou o erro específico
      });
    }
  });
});
