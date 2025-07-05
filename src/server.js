import Fastify from 'fastify'
import cors from '@fastify/cors'
import { documents } from './routes/documentsRoutes.js'


const fastify = Fastify({ logger: true })

fastify.register(cors, {
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"]
})

fastify.register(documents, { prefix: '/documents'})

try {
  await fastify.listen({ port: 8000 })
} catch (err) {
  fastify.log.error(err)
  process.exit(1)
}