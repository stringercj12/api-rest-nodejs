import { FastifyInstance } from "fastify"
import knex from "knex"

export async function transacationsRoutes(app: FastifyInstance) {
  app.get('/hello', async () => {
    const transaction = await knex('transactions').insert({
      id: crypto.randomUUID(),
      title: 'Transação de Teste',
      amount: 1000,
    }).returning('*')

    return transaction
  })

}