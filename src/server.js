import Fastify from 'fastify'
import { documents } from './routes/documents.js'
const fastify = Fastify({ logger: true })


fastify.register(documents, { prefix: '/documents'})

try {
  await fastify.listen({ port: 3333 })
} catch (err) {
  fastify.log.error(err)
  process.exit(1)
}