import database from "@/database/database";
import { refresh } from "next/cache";

type SessionType = {
  id: string;

  token: string;

  user_id: string;

  expires_at: string;

  created_at: string;

  updated_at: string;
};

async function createRefreshToken(userId: string): Promise<any> {
  const token = crypto.randomUUID();
  let refreshToken;
  try {
    refreshToken = await runQuery(userId);

    return refreshToken;
  } catch (error) {
    throw error;
    throw {
      message: "erro ao criar token refresh",
      cause: error,
    };
  }

  async function runQuery(userId: string): Promise<any> {
    try {
      await database.query("DELETE FROM sessions WHERE user_id = $1", [userId]);

      const result = await database.query(
        `
        INSERT INTO sessions (user_id, token, expires_at) 
        VALUES ($1, $2, NOW() + ($3 * INTERVAL '1 day')) 
        RETURNING *;
        `,
        [userId, token, "7"],
      );

      return result;
    } catch (e: any) {
      throw {
        message: "Erro refreshToken",
        cause: e,
      };
    }
  }
}

async function getRefreshToken(token: string) {
  try {
    const refreshToken = runQuery(token);
    return refreshToken;
  } catch (error) {
    throw {
      message: new Error("erro ao buscar token"),
      cause: error,
    };
  }

  async function runQuery(token: string) {
    return await database.query(
      `SELECT * FROM sessions WHERE token = $1 limit 1;`,
      [token],
    );
  }
}

async function getRefreshTokenByUserId(userId: string) {
  try {
    const refreshToken = runQuery(userId);
    return refreshToken;
  } catch (error) {
    throw {
      message: new Error("erro ao buscar token"),
      cause: error,
    };
  }

  async function runQuery(userId: string) {
    return await database.query(
      `SELECT * FROM sessions WHERE user_id = $1 limit 1;`,
      [userId],
    );
  }
}

async function deleteRefreshToken(token: string) {
  return await database.query(`DELETE FROM sessions WHERE token = $1;`, [
    token,
  ]);
}

const sessions = {
  deleteRefreshToken,
  createRefreshToken,
  getRefreshTokenByUserId,
  getRefreshToken,
};

export default sessions;
