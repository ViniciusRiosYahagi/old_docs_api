import { listDocuments } from "../schemas/documentsSchemas.js"

export function documents(fastify, options, done) {
  fastify.get('/', listDocuments)

  done()
}