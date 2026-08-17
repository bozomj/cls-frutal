import mail from "@/models/mail";
import orchestrator from "./orchestrator";

describe("teste nodemailer", () => {
  test("priemiro teste", async () => {
    await orchestrator.deleteAllEmails();

    await mail.send({
      to: "bozomj@gmail.com",
      subject: "fazendo outro teste",
      text: "nao sei o que esse texto faz",
      html: "<h1>quem é voce seu otario!!!</h1>",
    });

    await mail.send({
      to: "bozomj@gmail.com",
      subject: "Ultimo email e ai",
      text: "nao sei o que esse texto faz",
      html: "<h1>quem é voce seu otario!!!</h1>",
    });

    const lastEmail = await orchestrator.getLastEmail();
    const lastEmailBody = await lastEmail.json();
    const lastEmailItem = lastEmailBody.pop();

    expect(lastEmailItem.sender).toBe("<contato@bzmj.com.br>");
    expect(lastEmailItem.recipients[0]).toBe("<bozomj@gmail.com>");
    expect(lastEmailItem.subject).toBe("Ultimo email e ai");
  });
});
