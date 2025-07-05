import {
  listDocument,
  listDocuments,
  createDocument,
  deleteDocument,
  updateDocument,
} from "../schemas/documentsSchemas.js";

export function documents(fastify, options, done) {
  fastify.get("/", listDocuments);
  fastify.get("/:id", listDocument);
  fastify.post("/", createDocument);
  fastify.delete("/:id", deleteDocument);
  fastify.put("/:id", updateDocument)

  done();
}
