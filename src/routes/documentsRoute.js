import { listDocuments, getDocument, createDocument, editDocument, deleteDocument, searchDocument } from "../schemas/documentsSchema.js"

export function documents(fastify, options, done) {
  fastify.get("/", listDocuments)
  fastify.get("/:id", getDocument)
  fastify.post("/create", createDocument)
  fastify.put("/:id/edit", editDocument)
  fastify.delete("/:id", deleteDocument)
  fastify.get("/search", searchDocument)

  done()
}