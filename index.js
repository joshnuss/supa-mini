import express from 'express'
import WebSocket from 'ws'
import http from 'http'
import bodyParser from 'body-parser'
import { db, filter, maybeTransact } from './src/db.js'

const app = express()
const server = http.createServer(app)
const wss = new WebSocket.Server({server})

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

wss.on('connection', ws => {
  //connection is up, let's add a simple simple event
  ws.on('message', async payload => {
    const message = JSON.parse(payload)
    const send = (payload) => ws.send(JSON.stringify(payload))
    let command, results
    const transaction = ws.transaction

    switch (message.type) {
      case 'query':
        command = filter(message.table, message.query)
        results = await maybeTransact(command, transaction)

        send(results)
        break

      case 'insert':
        command = filter(message.table)
          .insert(message.payload)
          .returning('*')

        results = await maybeTransact(command, transaction)

        send(results)
        break

      case 'update':
        command = filter(message.table, message.query)
          .update(message.payload)
          .returning('*')

        results = await maybeTransact(command, transaction)

        send(results)
        break

      case 'delete':
        command = filter(message.table, message.query)
          .delete()
          .returning('*')

        results = await maybeTransact(command, transaction)

        send(results)
        break

      case 'tx:start':
        if (transaction) throw new Error('transaction is already open')

        const isolationLevel = message.isolationLevel || 'read committed'
        ws.transaction = await db.transaction({isolationLevel})

        send({"tx:start": true})
        break

      case 'tx:commit':
        if (!transaction || transaction.isCompleted()) throw new Error('no transaction is open')

        transaction.commit()
        ws.transaction = null

        send({"tx:commit": true})
        break

      case 'tx:rollback':
        if (!transaction || transaction.isCompleted()) throw new Error('no transaction is open')

        transaction.rollback()
        ws.transaction = null

        send({"tx:rollback": true})
        break

      default:
        send({message: `unknown type ${message.type}`})
    }
  })
})

server.listen(process.env.PORT || 3000)
