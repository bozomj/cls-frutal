import { UserDBType } from "@/shared/user_types";
import mail from "./mail";
import database from "@/database/database";
import webserver from "@/infra/webserver";

const EXPIRATION_IN_MILLISECONDS = 60 * 15 * 1000; // 15 MINUTES

async function findOneValidById(tokenId: string) {
  const activationTokeObject = await runInsertQuery(tokenId);
  return activationTokeObject;

  async function runInsertQuery(tokenId: string) {
    const results = await database.query(
      `SELECT
        *
      FROM
        user_activation_tokens
        WHERE
         id = $1
         AND expires_at > NOW()
         AND used_at IS null

        LIMIT
         1
      ;`,
      [tokenId],
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
  findOneValidById,
  create,
  sendEmailToUser,
};

export default activation;
