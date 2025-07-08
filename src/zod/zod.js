import { z } from "zod";

export const document = z.object({
  id: z.string(),
  title: z.string(),
  category: z.string(),
  author: z.string(),
  content: z.string(),
  created_at: z.date(),
  updated_at: z.date(),
});

export const dataRequired = z.object({
  title: z.string().min(3),
  category: z.string().min(3),
  author: z.string().min(3),
  content: z.string().min(100),
});

export const searchQuery = z.object({
  q: z.string().min(1),
});
