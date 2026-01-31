export interface Comment {
  id?: string;
  post_id: number;
  user_id: string;
  user_name: string;
  user_avatar: string;
  content: string;
  created_at?: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  content?: string;
  published: boolean;
  image_url?: string;
  authorId?: string;
  created_at: string;
  updatedAt?: string;
}
