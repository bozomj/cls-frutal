import { UserDBType } from "@/shared/user_types";
import mail from "./mail";

async function sendEmailToUser(user: UserDBType) {
  const email = await mail.send({
    to: user.email,
    subject: "Ative seu cadastro em CLS-CLASSIFICADOS-FRUTAL",
    text: `${user.name}, clique no link abaixo para ativar seu cadastro em CLS-CLASSIFICADOS-FRUTAL:

http://link.....

Atenciosamente,
Equipe CLS-CLASSIFICADOS-FRUTAL
    `,
    html: `${user.name}, clique no link abaixo para ativar seu cadastro em CLS-CLASSIFICADOS-FRUTAL:`,
  });

  console.log(email);
}

const activation = {
  sendEmailToUser,
};

export default activation;
