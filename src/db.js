import dotenv from 'dotenv'
import configure from 'knex'

dotenv.config()

export const db = configure({
  client: 'pg',
  connection: process.env.CONNECTION_STRING
})

export function maybeTransact(query, tx) {
  if (!tx) return query

  return query.transacting(tx)
}

export function filter(tableName, query = {}) {
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

