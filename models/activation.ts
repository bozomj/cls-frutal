import { UserDBType } from "@/shared/user_types";
import mail from "./mail";
import database from "@/database/database";
import webserver from "@/infra/webserver";

const EXPIRATION_IN_MILLISECONDS = 60 * 15 * 1000; // 15 MINUTES

async function findOneByUserId(userId: string) {
  console.log(userId);
  const newToken = await runInsertQuery(userId);
  return newToken;

  async function runInsertQuery(userId: string) {
    const results = await database.query(
      `SELECT
        *
      FROM
        user_activation_tokens
        WHERE
         user_id = $1
        LIMIT
         1
      ;`,
      [userId],
    );

    return results;
  }
}

async function create(userId: string) {
  const expiresAt = new Date(Date.now() + EXPIRATION_IN_MILLISECONDS);

  const newToken = await runInsertQuery(userId, expiresAt);
  return newToken;

  async function runInsertQuery(userId: string, expiresAt: Date) {
    const results = await database.query(
      `INSERT INTO
        user_activation_tokens (user_id, expires_at)
      VALUES
      ($1, $2)
      RETURNING
        *;
      `,
      [userId, expiresAt],
    );

    return results;
  }
}

async function sendEmailToUser(
  user: UserDBType,
  activationToken: { id: string },
) {
  const email = await mail.send({
    to: user.email,
    subject: "Ative seu cadastro em CLS-CLASSIFICADOS-FRUTAL",
    text: `${user.name}, clique no link abaixo para ativar seu cadastro em CLS-CLASSIFICADOS-FRUTAL:

${webserver.origin}/cadastro/ativar/${activationToken.id}

Atenciosamente,
Equipe CLS-CLASSIFICADOS-FRUTAL
    `,
    html: `${user.name}, clique no link abaixo para ativar seu cadastro em CLS-CLASSIFICADOS-FRUTAL:`,
  });

  console.log(email);
}

const activation = {
  findOneByUserId,
  create,
  sendEmailToUser,
};

export default activation;
