import { documents } from "./routes/documentsRoute.js";
import cors from "@fastify/cors"

import Fastify from "fastify";
const fastify = new Fastify({ logger: true });

fastify.register(cors, { origin:true,  methods: ["GET", "POST", "PUT", "DELETE"]})
fastify.register(documents, { prefix: "/documents" });

try {
  await fastify.listen({ port: 8000 });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
