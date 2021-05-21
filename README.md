# Micro implementation of PostgREST/Supabase

Very naive implementation. For testing purposes only. Completely insecure.

# Usage

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

Query server:

```bash
curl "localhost:3000/table?id.eq=123"
```

## License

MIT
