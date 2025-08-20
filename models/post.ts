import database from "@/database/database";
import imagem from "./imagem";

import { deleteObject, ref } from "firebase/storage";
import { storage } from "@/storage/firebase";

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

async function update(pst: PostType) {
  const query =
    "UPDATE posts SET title = $1, description = $2, valor = $3, categoria_id = $4 WHERE id = $5 and user_id = $6 RETURNING *";
  try {
    return (
      await database.query(query, [
        pst.title,
        pst.description,
        pst.valor,
        pst.categoria_id,
        pst.id,
        pst.user_id,
      ])
    )[0];
  } catch (error) {
    throw {
      message: new Error("Erro ao fazer alteração"),
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
  const imagens = await imagem.getByPostID(id);

  for (const img of imagens) {
    const deleteRef = ref(storage, img.url);
    await deleteObject(deleteRef);
  }

  //deleta imagem post local
  await imagem.delByPostId(id as string);
  //deleta posts
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

async function getByUserID(
  id: string,
  search: string,
  initial: string,
  limit: string
) {
  const query = `WITH ultimos_posts AS (
        SELECT *
        FROM posts
        WHERE posts.user_id = $1 
          AND (posts.title ilike $2 or posts.description ilike $2 )
        ORDER BY created_at DESC
        LIMIT $4 OFFSET $3
      )
      SELECT
        p.*,
        i.url AS imageurl
      FROM ultimos_posts p
      LEFT JOIN LATERAL (
        SELECT url FROM imagens WHERE post_id = p.id ORDER BY id ASC LIMIT 1
      ) i ON true;

        `;

  try {
    const posts = await database.query(query, [
      id,
      `%${search}%`,
      initial,
      limit,
    ]);

    return posts;
  } catch (e) {
    throw {
      id: id,
      message: "Erro ao listar posts por user_id",
      cause: e,
    };
  }
}
async function getByUserIDTotal(id: string, search: string) {
  try {
    const total = await database.query(
      `SELECT 
      count(
        posts.id
      ) as total
      from posts
      where posts.user_id = $1 and (posts.title ilike $2 or posts.description ilike $2 )
      `,
      [id, `%${search}%`]
    );

    return total[0];
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
        perfil_images.url as img_profile,
        MIN(users.name) as name,
        json_agg(imagens.*) AS imagens
      FROM posts
      LEFT JOIN imagens ON imagens.post_id = posts.id
      LEFT JOIN users ON users.id = posts.user_id
      LEFT JOIN perfil_images ON perfil_images.user_id = posts.user_id AND perfil_images.selected = true
      WHERE posts.id = $1 
      GROUP BY posts.id, users.email, perfil_images.url, users.phone;
      
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

async function search(txt: string, initial: string, limit: string | null) {
  try {
    const posts = await database.query(
      `WITH ultimos_posts AS (
        SELECT *
        FROM posts
        WHERE title ILIKE $1 OR description ILIKE $1
        ORDER BY created_at DESC
        LIMIT $2 OFFSET $3
      )
      SELECT
        p.*,
        i.url AS imageurl
      FROM ultimos_posts p
      LEFT JOIN LATERAL (
        SELECT url FROM imagens WHERE post_id = p.id ORDER BY id ASC LIMIT 1
      ) i ON true;

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
  update,

  getTotal,
  getByUserIDTotal,
};

export default Post;
