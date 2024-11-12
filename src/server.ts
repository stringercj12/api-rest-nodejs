import fastify from 'fastify'
import crypto from 'node:crypto';
import cookie from '@fastify/cookie'

import { knex } from './database'
import { env } from './env';
import { transacationsRoutes } from './routes/transactions';

const app = fastify()

app.register(cookie)

app.register(transacationsRoutes, {
  prefix: 'transactions'
})

app.listen({
  port: env.PORT,
}).then(() => {
  console.log('HTTP Server Running')
})
