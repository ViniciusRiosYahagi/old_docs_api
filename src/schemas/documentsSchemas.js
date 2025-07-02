import { z } from "zod"
import zodToJsonSchema from "zod-to-json-schema"
import { findMany } from "../services/documentsServices.js"

const document = z.object({
  id: z.string(),
  title: z.string().min(1),
  description: z.string().min(1),
  category: z.string().min(1),
  created_at: z.date(),
  updated_at: z.date()
})

export const listDocuments = {
  schema: {
    response: {
      201: {
        type: 'array',
        items: zodToJsonSchema(document)
      }
    }
  },
  handler: async (req, reply) => {
    const items = await findMany()
    reply.send(items)
  }
}