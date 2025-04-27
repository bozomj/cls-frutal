export type post = {
  id: string;
  userId: string;
  title: string;
  description: string;
  createdAt: string;
};

function createPost(pst: post): post {
  return pst;
}

export default createPost;
