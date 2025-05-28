import database from "@/database/database";

export type postType = {
  id?: string;
  userId: string;
  title: string;
  description: string;
  valor: number;
  categoria_id: string;
  content: string;
  createdAt?: EpochTimeStamp;
};

function isPostType(obj: unknown): obj is postType {
  if (typeof obj !== "object" || obj === null) return false;
  const o = obj as Record<string, unknown>;
  return (
    typeof o.userId === "string" &&
    typeof o.title === "string" &&
    typeof o.description === "string" &&
    typeof o.valor === "number" &&
    typeof o.categoria_id === "string" &&
    typeof o.content === "string"
  );
}

async function create(pst: postType) {
  if (!isPostType(pst)) {
    throw {
      message: "JSON incorreto",
    };
  }

  Object.values(pst).forEach((v) => {
    if (v == "" || v == null) {
      throw "campo com valores incorretos";
    }
  });

  const query =
    'INSERT INTO posts ("userId", title, description, content) VALUES ($1,$2,$3,$4) RETURNING *;';

  try {
    return await database.query(query, [
      pst.userId,
      pst.title,
      pst.description,
      pst.content,
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
    const posts = await database.query("select * from posts");
    return posts;
  } catch (error) {
    throw {
      message: "Erro ao listar todas postagens",
      cause: error,
    };
  }
}

const Post = {
  create,
  listAllPost,
};

export default Post;
