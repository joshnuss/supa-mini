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
curl -x POST localhost:3000/products \
  -H 'content-type: application/json' \
  --data '{"name": "t-shirt", "price": 25}'
```

Deleting:

```bash
curl -x DELETE "localhost:3000/products?id.eq=1"
```

## License

MIT
