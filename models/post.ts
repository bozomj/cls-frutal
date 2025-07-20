import database from "@/database/database";

export type PostType = {
  id?: string;
  user_id: string;
  title: string;
  description: string;
  valor: number;
  email: string;
  categoria_id: number;
  imageurl?: string;
  phone: string;
  name: string;
  created_at?: EpochTimeStamp;
};

function isPostType(obj: unknown): obj is PostType {
  if (typeof obj !== "object" || obj === null) return false;
  const o = obj as Record<string, unknown>;
  return (
    typeof o.user_id === "string" &&
    typeof o.title === "string" &&
    typeof o.description === "string" &&
    typeof o.valor === "number" &&
    typeof o.categoria_id === "number"
  );
}

async function create(pst: PostType) {
  console.log("JSON", pst);
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
    "INSERT INTO posts (user_id, title, description, valor, categoria_id) VALUES ($1,$2,$3,$4,$5) RETURNING *;";

  try {
    return await database.query(query, [
      pst.user_id,
      pst.title,
      pst.description,
      pst.valor,
      pst.categoria_id,
    ]);
  } catch (error) {
    throw {
      message: new Error("erro ao postar prodruto"),
      cause: error,
    };
  }
}

async function getTotal(search: string) {
  try {
    const total = await database.query(
      `
          SELECT COUNT(title) as total FROM posts where title ilike $1 or description ilike $1;
        `,
      [`%${search}%`]
    );
    console.log(total);
    return total;
  } catch (e) {
    throw { error: "erro ao buscar total de posts", cause: e };
  }
}

async function listAllPost(initial: string, limit: string) {
  try {
    const posts = await database.query(
      `SELECT * FROM (
        select distinct on (posts.id)
         posts.*, 
         users.phone AS phone,
         users.name as name,
         imagens.url as imageUrl
        from posts
        left join imagens on imagens.post_id = posts.id
        LEFT JOIN users ON users.id = posts.user_id
      ) AS sub ORDER BY sub.created_at desc
       limit $1 offset  $2
       `,
      [limit, initial]
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
  try {
    const posts = await database.query(
      `SELECT distinct on (posts.id)
        posts.*,
        imagens.url as imageurl,
        users.email,
        users.phone as phone
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
      message: "Erro ao listar posts por user_id",
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
        users.phone as phone,
        MIN(users.name) as name,
        json_agg(imagens.*) AS imagens
      FROM posts
      LEFT JOIN imagens ON imagens.post_id = posts.id
      LEFT JOIN users ON users.id = posts.user_id
      WHERE posts.id = $1
      GROUP BY posts.id, users.email, phone
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

async function search(txt: string, initial: string, limit: string) {
  try {
    const posts = await database.query(
      `select distinct on (posts.id) 
        posts.*,
        imagens.url as imageurl
        from posts left join imagens on imagens.post_id = posts.id
        where posts.title ilike $1 or posts.description ilike $1
        limit $2 offset $3
        `,
      [`%${txt}%`, limit, initial]
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
  getTotal,
};

export default Post;
