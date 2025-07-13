import database from "@/database/database";

export type PostType = {
  id?: string;
  userId: string;
  title: string;
  description: string;
  valor: number;
  categoria_id: string;
  url?: string;
  createdAt?: EpochTimeStamp;
};

function isPostType(obj: unknown): obj is PostType {
  if (typeof obj !== "object" || obj === null) return false;
  const o = obj as Record<string, unknown>;
  return (
    typeof o.userId === "string" &&
    typeof o.title === "string" &&
    typeof o.description === "string" &&
    typeof o.valor === "number" &&
    typeof o.categoria_id === "string"
  );
}

async function create(pst: PostType) {
  if (!isPostType(pst)) {
    throw {
      message: "JSON incorreto",
    };
  }

  Object.values(pst).forEach((v) => {
    if (v == "" || v == null) {
      throw { cause: "campo com valores incorretos", valores: pst };
    }
  });

  const query =
    "INSERT INTO posts (user_id, title, description, valor) VALUES ($1,$2,$3,$4) RETURNING *;";

  try {
    return await database.query(query, [
      pst.userId,
      pst.title,
      pst.description,
      pst.valor,
    ]);
  } catch (error) {
    throw {
      message: new Error("erro ao postar prodruto"),
      cause: error,
    };
  }
}

async function listAllPost() {
  try {
    const posts = await database.query(
      `SELECT * FROM (
        select distinct on (posts.id) posts.*,
       imagens.url from posts left join imagens on imagens.post_id = posts.id
      ) AS sub ORDER BY sub."createdAt" desc
       `
    );

    return posts;
  } catch (error) {
    throw {
      message: "Erro ao listar todas postagens",
      cause: error,
    };
  }
}

async function deletePost(id: string, userId: string) {
  try {
    const posts = await database.query(
      "delete from posts where id = $1 and user_id = $2 RETURNING *",
      [id, userId]
    );
    return posts;
  } catch (error) {
    throw {
      message: "Erro ao deletar",
      cause: error,
    };
  }
}

async function getByUserID(id: string) {
  console.log(">>>", id);
  try {
    const posts = await database.query(
      `SELECT distinct on (posts.id)
        posts.*,
        imagens.url,
        users.email
      from posts
      left join
       imagens on imagens.post_id = posts.id
      left join users on users.id = posts.user_id
      where posts.user_id = $1
      order by posts.id, imagens.id
      `,
      [id]
    );

    return posts;
  } catch (e) {
    throw {
      id: id,
      message: "Erro ao listar posts por userId",
      cause: e,
    };
  }
}
async function getById(id: string) {
  try {
    const posts = await database.query(
      `SELECT 
        posts.*,
        users.email,
        MIN(users.name) as name,
        json_agg(imagens.*) AS imagens
      FROM posts
      LEFT JOIN imagens ON imagens.post_id = posts.id
      LEFT JOIN users ON users.id = posts.user_id
      WHERE posts.id = $1
      GROUP BY posts.id, users.email
      `,
      [id]
    );

    return posts;
  } catch (e) {
    throw {
      id: id,
      message: "Erro ao listar posts por userId",
      cause: e,
    };
  }
}

async function search(txt: string) {
  try {
    const posts = await database.query(
      `select distinct on (posts.id) 
        posts.*,
        imagens.url
        from posts left join imagens on imagens.post_id = posts.id
        where posts.title ilike $1
        `,
      [`%${txt}%`]
    );
    return posts;
  } catch (error) {
    return { message: error };
  }
}

const Post = {
  getById,
  create,
  search,
  deletePost,
  listAllPost,
  getByUserID,
};

export default Post;
