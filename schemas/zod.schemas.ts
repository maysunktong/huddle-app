import { z } from 'zod';

export const logInSchema = z.object({
  email: z.email("Enter a valid email"),
  password: z.string().min(6, 'Password minimum 6 characters')
})

export const signUpSchema = z.object({
  email: z.email("Enter a valid email"),
  password: z.string().min(6, 'Password minimum 6 characters'),
  username: z.string().min(6, 'Username minimum 6 characters')

})

export const addPostSchema = z.object({
  title: z.string().min(1, "Please add you title"),
  content: z.string("").optional(),
  images: z.instanceof(FormData).optional()
})

export const CommentSchema = z.object({
  id: z.string(),
  content: z.string(),
  post_id: z.string(),
  user_id: z.string(),
});

export type CommentType = {
  id: string;
  content: string;
  post_id: string;
  user_id: string;
  profile?: {
    username: string;
    avatar_url?: string | null;
  };
};

export const CommentInsertSchema = z.object({
  content: z.string(),
  post_id: z.string(),
  user_id: z.string(),
});

export type CommentInsertType = z.infer<typeof CommentInsertSchema>;
