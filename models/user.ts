import database from "@/database/database";
import password from "@/models/password";
import dotenv from "dotenv";
import autenticator from "@/models/autenticator";
import { UserDBType } from "@/shared/user_types";

dotenv.config({ path: ".env.development" });

async function findAll() {
  try {
    const result = await database.query(
      'SELECT id, name, email, phone,  "createdAt" FROM users;',
    );

    return result;
  } catch (error) {
    throw {
      message: new Error("Erro ao buscar usuários"),
      cause: { CAUSE: error },
    };
  }
}

async function getTotalUsers() {
  const result = await database.query(
    `
      SELECT COUNT(*) AS total FROM users;
      `,
  );
  return result;
}

async function findById(id: string) {
  const result = await database.query(
    `
      SELECT users.*, perfil_images.url 
      FROM users 
      LEFT JOIN perfil_images
       ON perfil_images.user_id = users.id
       AND perfil_images.selected = true
      where users.id = $1;
      `,
    [id],
  );

  if (result < 1) {
    throw {
      message: new Error("Usuário não encontrado pelo ID"),
      cause: result,
    };
  }

  return result;
}

async function findByName(username: string) {
  let dbClient;
  try {
    dbClient = await database.getNewClient();
    const result = await database.query(
      "SELECT * from users where LOWER(name) = $1;",
      [username],
    );

    return result;
  } catch (error) {
    throw {
      message: new Error("Erro ao buscar usuário"),
      cause: { CAUSE: error },
    };
  } finally {
    if (dbClient) {
      await dbClient.end();
    }
  }
}

async function findByEmail(email: string) {
  const result = await database.query(
    "SELECT * from users where LOWER(email) = LOWER($1) limit 1;",
    [email],
  );
  return result;
}

async function create(
  userInputValues: Record<string, string | number | boolean>,
) {
  try {
    await validateUniqueEmail(userInputValues.email as string);
    injectDefaultFeaturesInObject(userInputValues);
  } catch (error) {
    throw error;
  }

  try {
    return await runInsertQuery(userInputValues);
  } catch (error) {
    throw {
      message: new Error("Erro ao criar usuário"),
      cause: { CAUSE: error },
    };
  }

  function injectDefaultFeaturesInObject(userInputValues: any) {
    userInputValues.features = ["read:activation_token"];
  }

  async function validateUniqueEmail(email: string) {
    const user = await User.findByEmail(email);
    if (user.length > 0) {
      throw {
        message: "O email informado já está sendo utilizado",
        cause: user,
      };
    }
  }

  async function runInsertQuery(
    userImputValues: Record<string, string | number | boolean>,
  ) {
    try {
      return await database.query(
        "INSERT INTO users (name, email, password, is_admin, phone, features) VALUES (LOWER($1), LOWER($2), $3, $4, $5, $6) RETURNING *;",
        [
          userImputValues.name,
          userImputValues.email,
          await password.hashPassword(userInputValues.password as string),
          userImputValues.is_admin || false,
          userImputValues.phone,
          userImputValues.features,
        ],
      );
    } catch (error) {
      throw {
        message: new Error("Erro ao criar usuário - interno"),
        cause: { CAUSE: error },
      };
    }
  }
}

async function update(user: Partial<UserDBType>) {
  const entries = { ...user };
  delete entries.id;

  const query = `
    UPDATE users
    SET name = $2, phone = $3
    WHERE id = $1
    RETURNING *;
    `;

  try {
    return (await database.query(query, [user.id, user.name, user.phone]))[0];
  } catch (error) {
    throw {
      message: new Error("Erro ao fazer alteração"),
      cause: error,
    };
  }
}

async function login(email: string, senha: string) {
  const user = await User.findByEmail(email);

  if (user.length < 1)
    throw {
      message: new Error("Usuário não encontrado"),
      cause: { CAUSE: user },
    };

  if (!user[0].features.includes("create:session"))
    throw {
      message: "Usuario sem permissão, verifique sua ativação!",
      cause: user,
      codeError: "01",
    };

  const passwordMatch = await password.comparePassword(senha, user[0].password);

  if (!passwordMatch) {
    throw {
      message: "Senha incorreta",
      cause: { passwordMatch: passwordMatch },
    };
  }

  const token = autenticator.createToken(user[0].id);
  return token;
}

async function setFeatures(userId: string, features: string[]) {
  const updatedUser = await runUpdateQuery(userId, features);
  return updatedUser;

  async function runUpdateQuery(userId: string, features: string[]) {
    const results = await database.query(
      `
        UPDATE
          users 
        SET 
          features = $2,
          updated_at = timezone('utc', now())
        WHERE
          id = $1
        RETURNING
          *;`,
      [userId, features],
    );

    return results;
  }
}

const User = {
  findAll,
  getTotalUsers,
  findById,
  findByName,
  findByEmail,
  create,
  update,
  login,
  setFeatures,
};

export default User;
