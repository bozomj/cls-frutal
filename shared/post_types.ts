import { PostStatus } from "./post_status";

export type PostDBType = {
  title: string;
  description: string;
  user_id: string;
  valor: number;
  categoria_id: number;
  created_at: number;
  status?: string;
};

export type PostDetailType = {
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
  created_at?: string;
  updated_at?: string;
  status: PostStatus;
  imagens: { url: string }[];
  img_profile: string;
};
