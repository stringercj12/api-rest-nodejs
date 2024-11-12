import { FastifyInstance } from 'fastify'
import knex from 'knex'
import { randomUUID } from 'node:crypto'
import { z } from 'zod'

export async function transacationsRoutes(app: FastifyInstance) {
  app.get('/', async () => {
    const transactions = await knex('transactions').select('*')

    return {
      transactions
    };
  })

  app.get('/:id', async (request) => {
    const getTransactionParamsSchema = z.object({
      id: z.string().uuid()
    })

    const { id } = getTransactionParamsSchema.parse(request.params)

    const transaction = await knex('transactions').where('id', id).first();

    return {
      transaction
    }
  })

  app.get('/summary', async () => {
    const summary = await knex('transactions').sum('amount', { as: 'amount' }).first()

    return {
      summary
    }
  })

  app.get('/', async (request, reply) => {
    const createTransactionBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(['credit', 'debit']),
    })

    const { title, amount, type } = createTransactionBodySchema.parse(
      request.body,
    )

    let sessionId = request.cookies.sessionId;

    if (!sessionId) {
      sessionId = randomUUID()

      reply.cookie('sessionId', sessionId, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7 // 7 days
      })
    }

    await knex('transactions')
      .insert({
        id: crypto.randomUUID(),
        title,
        amount: type === 'credit' ? amount : amount * -1,
        session_id: sessionId
      })
      .returning('*')

    return reply.status(201).send()
  })
}
