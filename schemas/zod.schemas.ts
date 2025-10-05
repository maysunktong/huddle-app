import { z } from 'zod';

export const logInSchema = z.object({
  email: z.email("Please enter a valid email"),
  password: z.string().min(6, 'Your password must be a minimum of 6 characters')
})

export const signUpSchema = z.object({
  email: z.email("Please enter a valid email"),
  password: z.string().min(6, 'Your password must be a minimum of 6 characters'),
  username: z.string().min(6, 'Username needs to be a minimum of 6 characters')

})

export const addPostSchema = z.object({
  title: z.string().min(1, "Please add you title"),
  content: z.string("").optional()
})
