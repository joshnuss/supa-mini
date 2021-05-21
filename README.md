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

## Usage

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

## License

MIT
