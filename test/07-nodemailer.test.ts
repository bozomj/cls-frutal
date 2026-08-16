import mail from "@/models/mail";

// jest.setTimeout(15000);

const mailHttpUrl = `http://${process.env.EMAIL_HTTP_HOST}:${process.env.EMAIL_HTTP_PORT}`;

async function deleteAllEmails() {
  return await fetch(`${mailHttpUrl}/messages`, {
    method: "DELETE",
  });
}

async function getLastEmail() {
  return await fetch(`${mailHttpUrl}/messages`);
}

describe("teste nodemailer", () => {
  test("priemiro teste", async () => {
    await deleteAllEmails();

    await mail.send({
      to: "bozomj@gmail.com",
      subject: "fazendo outro teste",
      text: "nao sei o que esse texto faz",
      html: "<h1>quem é voce seu otario!!!</h1>",
    });

    await mail.send({
      to: "bozomj@gmail.com",
      subject: "do MEIO email e ai",
      text: "nao sei o que esse texto faz",
      html: "<h1>quem é voce seu otario!!!</h1>",
    });

    await mail.send({
      to: "bozomj@gmail.com",
      subject: "Ultimo email e ai",
      text: "nao sei o que esse texto faz",
      html: "<h1>quem é voce seu otario!!!</h1>",
    });

    const lastEmail = await getLastEmail();
    const lastEmailBody = await lastEmail.json();
    const lastEmailItem = lastEmailBody.pop();

    const emailTextResponse = await fetch(
      `${mailHttpUrl}/messages/${lastEmailItem.id}.plain`,
    );
    const emailTextBody = await emailTextResponse.text();

    lastEmailItem.text = emailTextBody;

    expect(lastEmailItem.sender).toBe("<contato@bzmj.com.br>");
    expect(lastEmailItem.recipients[0]).toBe("<bozomj@gmail.com>");
    expect(lastEmailItem.subject).toBe("Ultimo email e ai");
    expect(lastEmailItem.text).toBe("nao sei o que esse texto faz");

    console.log(lastEmailItem);
  });
});
