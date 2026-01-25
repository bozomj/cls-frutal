import database from "@/database/database";
import imagem from "./imagem";

import { deleteFile } from "@/storage/cloudflare/r2Cliente";
import { PostStatus } from "@/shared/post_status";
import { PostDetailType } from "@/shared/post_types";
import { ImageStatus } from "@/shared/Image_types";

function isPostType(obj: unknown): obj is PostDetailType {
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

async function create(pst: PostDetailType) {
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
    "INSERT INTO posts (user_id, title, description, valor, categoria_id, status) VALUES ($1,$2,$3,$4,$5,$6 ) RETURNING *;";

  try {
    return await database.query(query, [
      pst.user_id,
      pst.title,
      pst.description,
      pst.valor,
      pst.categoria_id,
      PostStatus.PENDING,
    ]);
  } catch (error) {
    console.log(error);
    throw {
      message: new Error("erro ao postar prodruto"),
      cause: error,
    };
  }
}

async function update(
  id: string,
  userId: string,
  data: Partial<PostDetailType>,
) {
  const allowed = ["title", "description", "valor", "categoria_id", "status"];

  const entries = Object.entries(data).filter(([k]) => allowed.includes(k));

  if (!entries.length) return null;

  const set = entries.map(([k], i) => `${k} = $${i + 1}`).join(", ");

  const values = entries.map(([, v]) => v);

  const query = `
    UPDATE posts
    SET ${set}, updated_at = now()
    WHERE id = $${values.length + 1}
      AND user_id = $${values.length + 2}
    RETURNING *;
      `;
  try {
    return (await database.query(query, [...values, id, userId]))[0];
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
      [`%${search}%`],
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
      [limit, initial],
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
    try {
      await deleteFile(img.url);
    } catch (error) {
      console.log("Erro ao deletar imagem no firebase", error);
    }
  }

  //deleta imagem post local
  await imagem.delByPostId(id as string);
  //deleta posts
  try {
    const posts = await database.query(
      "delete from posts where id = $1 and user_id = $2 RETURNING *",
      [id, userId],
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
  limit: string,
) {
  const query = `
WITH ultimos_posts AS (
  SELECT
    posts.*,
    COUNT(*) OVER() AS total
  FROM posts
  WHERE posts.user_id = $1
    AND (posts.title ILIKE $2 OR posts.description ILIKE $2)
  ORDER BY created_at DESC
  LIMIT $4 OFFSET $3
)
SELECT
  p.*,
  p.total,
  users.phone AS phone,
  i.url AS imageurl
FROM ultimos_posts p
LEFT JOIN users ON users.id = p.user_id
LEFT JOIN LATERAL (
  SELECT url
  FROM imagens
  WHERE post_id = p.id
  ORDER BY id ASC
  LIMIT 1
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
      [id, `%${search}%`],
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
        COALESCE(
      json_agg(imagens.*) FILTER (WHERE imagens.id IS NOT NULL),
      '[]'
    ) AS imagens

      FROM posts
      LEFT JOIN imagens ON imagens.post_id = posts.id and imagens.status = $2
      LEFT JOIN users ON users.id = posts.user_id
      LEFT JOIN perfil_images ON perfil_images.user_id = posts.user_id AND perfil_images.selected = true
      WHERE posts.id = $1 
      GROUP BY posts.id, users.email, perfil_images.url, users.phone;
      
      `,
      [id, ImageStatus.ACTIVE],
    );

    return posts.length > 0 ? posts[0] : null;
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
      //preciso que coloque o total de resultado tbm pra usar como paginacao

      `WITH ultimos_posts AS (
        SELECT *,
        COUNT(*) OVER() AS total
        FROM posts
        WHERE
        status = $4 AND (title ILIKE $1 OR description ILIKE $1)
        ORDER BY created_at DESC
        LIMIT $2 OFFSET $3
      )
      SELECT
        p.*,
        i.url AS imageurl,
        users.phone AS phone
      FROM ultimos_posts p
      LEFT JOIN users ON users.id = p.user_id
      LEFT JOIN LATERAL (
        SELECT url FROM imagens WHERE post_id = p.id and status = $4
       ORDER BY id ASC LIMIT 1
      ) i ON true;

        `,
      [`%${txt}%`, limit, initial, PostStatus.ACTIVE],
    );

    return posts;
  } catch (error) {
    return { message: error };
  }
}

async function getPostByStatus(initial: string, limit: string, status: string) {
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
        where posts.status = $3
      ) AS sub ORDER BY sub.created_at desc
       limit $1 offset  $2
       `,
      [limit, initial, status],
    );

    return posts;
  } catch (error) {
    throw {
      message: "Erro ao listar todas postagens pendentes",
      cause: error,
    };
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
  getPostByStatus,
};

export default Post;
