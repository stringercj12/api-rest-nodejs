import { FastifyInstance } from 'fastify'
import knex from 'knex'
import { z } from 'zod'

export async function transacationsRoutes(app: FastifyInstance) {
  app.get('/', async (request, reply) => {
    const createTransactionBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(['credit', 'debit']),
    })

    const { title, amount, type } = createTransactionBodySchema.parse(
      request.body,
    )

    await knex('transactions')
      .insert({
        id: crypto.randomUUID(),
        title,
        amount: type === 'credit' ? amount : amount * -1,
      })
      .returning('*')

    return reply.status(201).send()
  })
}
