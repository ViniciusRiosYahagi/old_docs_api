import { documents } from "./routes/documentsRoute.js";
import {fastifyCors} from "@fastify/cors"

import Fastify from "fastify";
const fastify = new Fastify({ logger: true });

fastify.register(fastifyCors, { origin: "*" })
fastify.register(documents, { prefix: "/documents" });

try {
  await fastify.listen({ port: 8000 });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
