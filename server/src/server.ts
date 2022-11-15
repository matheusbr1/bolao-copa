import Fastify from "fastify";
import cors from '@fastify/cors'
import { poolRoutes } from "./routes/pool";
import { guessRoutes } from "./routes/guess";
import { userRoutes } from "./routes/user";
import { authRoutes } from "./routes/auth";
import { gameRoutes } from "./routes/game";

import jwt from '@fastify/jwt'

async function start() {
  const fastify = Fastify({
    logger: true
  })

  await fastify.register(cors, {
    origin: true // Allows any origin to access out backend
  })

  await fastify.register(jwt, {
    secret: 'nlwcopa'
  })

  await fastify.register(authRoutes)
  await fastify.register(gameRoutes)
  await fastify.register(guessRoutes)
  await fastify.register(poolRoutes)
  await fastify.register(userRoutes)

  await fastify.listen({
    port: 3333,
    host: '0.0.0.0'
  })
}

start()