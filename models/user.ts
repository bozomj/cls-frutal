import database from "@/database/database";
import password from "@/models/password";
import dotenv from "dotenv";
import autenticator from "@/models/autenticator";

dotenv.config({ path: ".env.development" });

export type UserType = {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: string;
  is_admin: boolean;
};

const User = {
  findAll: async () => {
    try {
      const result = await database.query(
        "SELECT id, name, email, phone, 'createdAt' FROM users;"
      );

      return result;
    } catch (error) {
      throw {
        message: new Error("Erro ao buscar usuários"),
        cause: { CAUSE: error },
      };
    }
  },

  findById: async (id: string) => {
    const result = await database.query("SELECT * from users where id = $1;", [
      id,
    ]);

    if (result < 1) {
      throw {
        message: new Error("Usuário não encontrado pelo ID"),
        cause: result,
      };
    }
    return result;
  },

  findByName: async (username: string) => {
    let dbClient;
    try {
      dbClient = await database.getNewClient();
      const result = await database.query(
        "SELECT * from users where LOWER(name) = $1;",
        [username]
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
  },

  findByEmail: async (email: string) => {
    const result = await database.query(
      "SELECT * from users where LOWER(email) = LOWER($1) limit 1;",
      [email]
    );
    return result;
  },

  create: async (
    userInputValues: Record<string, string | number | boolean>
  ) => {
    try {
      await validateUniqueEmail(userInputValues.email as string);
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
      userImputValues: Record<string, string | number | boolean>
    ) {
      try {
        return await database.query(
          "INSERT INTO users (name, email, password, is_admin, phone) VALUES (LOWER($1), LOWER($2), $3, $4, $5) RETURNING *;",
          [
            userImputValues.name,
            userImputValues.email,
            await password.hashPassword(userInputValues.password as string),
            userImputValues.is_admin || false,
            userImputValues.phone,
          ]
        );
      } catch (error) {
        throw {
          message: new Error("Erro ao criar usuário - interno"),
          cause: { CAUSE: error },
        };
      }
    }
  },

  login: async (email: string, senha: string) => {
    const user = await User.findByEmail(email);
    if (user.length < 1) {
      throw {
        message: new Error("Usuário não encontrado"),
        cause: { CAUSE: user },
      };
    }

    const passwordMatch = await password.comparePassword(
      senha,
      user[0].password
    );

    if (!passwordMatch) {
      throw {
        message: "Senha incorreta",
        cause: { passwordMatch: passwordMatch },
      };
    }

    const token = autenticator.createToken(user[0].id);
    return token;
  },
};

export default User;
