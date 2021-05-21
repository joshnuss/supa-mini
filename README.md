# Micro implementation of PostgREST/Supabase

Very naive implementation. For testing purposes only. Completely insecure.

# Setup

Setup `CONNECTION_STRING` in  `.env`:

```bash
cp .env.example .env
```

Install deps:

```bash
yarn
```

Start server:

```
yarn start
```

## HTTP Interface

Querying:

```bash
curl "localhost:3000/products"
```

Filtering:

```bash
curl "localhost:3000/products?id.eq=123"
```

Inserting:

```bash
curl -X POST localhost:3000/products \
  -H 'content-type: application/json' \
  --data '{"name": "t-shirt", "price": 25}'
```

Updating:

```bash
curl -X PUT "localhost:3001/products?id.eq=1" \
  -H 'content-type: application/json' \
  --data '{"price": "99.99"}'
```

Deleting:

```bash
curl -X DELETE "localhost:3000/products?id.eq=1"
```

## WebSocket interface

All payloads are in a JSON format

Querying:

```bash
> wscat --connect ws://localhost:3000
> {"type": "query", "table": "products"}
< [{"id":7,"name":"t-shirt","description":null,"price":"$99.99"},{"id":9,"name":"socks","description":null,"price":"$2.00"}]
```

Filtering:

```bash
> wscat --connect ws://localhost:3000
> {"type": "query", "table": "products", "query": {"id.eq", 7}}
< [{"id":7,"name":"t-shirt","description":null,"price":"$99.99"}]
```

Inserting:

```bash
> wscat --connect ws://localhost:3000
> {"type": "insert", "table": "products", "payload": {"name", "pants", "price": "80"}}
```

Updating:

```bash
> wscat --connect ws://localhost:3000
> {"type": "update", "table": "products", "query": {"id.eq", 7}, "payload": {"name": "shirt"}}
< [{"id":7,"name":"shirt","description":null,"price":"$99.99"}]
```

Deleting:

```bash
> wscat --connect ws://localhost:3000
> {"type": "delete", "table": "products", "query": {"id.eq", 7}}
```

Committing a transaction:

```bash
> wscat --connect ws://localhost:3000
> {"type": "tx:start"}
< {"tx:start":true}
> {"type": "insert", "table": "products", "payload": {"name": "socks", "price": "444"}}
< [{"id":13,"name":"socks","description":null,"price":"$444.00"}]
> {"type": "insert", "table": "products", "payload": {"name": "socks", "price": "999"}}
< [{"id":14,"name":"socks","description":null,"price":"$999.00"}]
> {"type": "tx:commit"}
```

Rolling back a transaction:

```bash
> wscat --connect ws://localhost:3000
> {"type": "tx:start"}
< {"tx:start":true}
> {"type": "insert", "table": "products", "payload": {"name": "socks", "price": "444"}}
< [{"id":13,"name":"socks","description":null,"price":"$444.00"}]
> {"type": "insert", "table": "products", "payload": {"name": "socks", "price": "999"}}
< [{"id":14,"name":"socks","description":null,"price":"$999.00"}]
> {"type": "tx:rollback"}
```

## License

MIT
