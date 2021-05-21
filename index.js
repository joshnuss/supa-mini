import dotenv from 'dotenv'
import express from 'express'
import bodyParser from 'body-parser'
import configure from 'knex'

dotenv.config()

const db = configure({
  client: 'pg',
  connection: process.env.CONNECTION_STRING
})

const app = express()

app.use(bodyParser.json())

app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).json({message: "unexpected error"})
})

app.get('/:table', async (req, res) => {
  const results = await filter(req.params.table, req.query)

  res.json(results)
})

app.post('/:table', async (req, res) => {
  const results = await db(req.params.table)
    .insert(req.body)
    .returning('*')

  res.json(results)
})

app.put('/:table', async (req, res) => {
  console.log(req.body)
  const results = await filter(req.params.table, req.query)
    .update(req.body)
    .returning('*')

  res.json(results)
})

app.delete('/:table', async (req, res) => {
  const results = await filter(req.params.table, req.query)
    .delete()
    .returning('*')

  res.json(results)
})

function filter(tableName, query) {
  console.log(query)
  let table = db(tableName)
  const keys = Object.keys(query)

  if (keys.length === 0) return table

  keys.forEach(key => {
    const [column, op] = key.split('.')
    const value = query[key]

    switch (op) {
      case 'eq':
        table = table.where(column, value)
        break
      case 'gt':
        table = table.where(column, '>', value)
        break
      case 'gte':
        table = table.where(column, '>=', value)
        break
      case 'lt':
        table = table.where(column, '<', value)
        break
      case 'lte':
        table = table.where(column, '<=', value)
        break
      case 'neq':
        table = table.where(column, '!=', value)
        break
      case 'like':
        table = table.where(column, 'like', `%${value}%`)
        break
      case 'ilike':
        table = table.where(column, 'ilike', `%${value}%`)
        break
      case 'is':
        switch (value.toLowerCase()) {
          case 'null':
            table = table.whereNull(column)
            break;
          case 'false':
            table = table.where(column, false)
            break;
          case 'true':
            table = table.where(column, true)
            break;
        }
        break
      default:
        throw new Error(`Unknown filter ${key}=${value}`)
    }
  })

  return table
}

app.listen(process.env.PORT || 3000)
