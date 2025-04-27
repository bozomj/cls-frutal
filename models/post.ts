import database from "@/database/database";

export type postType = {
  id?: string;
  userId: string;
  title: string;
  description: string;
  content: string;
  createdAt?: EpochTimeStamp;
};

async function create(pst: postType) {
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
