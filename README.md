# Headline Lab

A personal marketing headline laboratory.

- **Generator** — pick a saved Structure + a Topic, click Generate, and get 10 marketing
  headlines that follow the structure. The app calls the Anthropic API through a local
  proxy; you never see or copy a prompt.
- **Structures** — your saved headline/copy structures and frameworks.
- **Topics** — your saved marketing topics, each with a description + pains. Ships with
  starter topics; add your own.

Structures and Topics are stored in the browser's `localStorage` and survive refresh and
restart. Generated headlines are not stored. Export / Import JSON backs up the libraries.

## Running

```
cp .env.example .env        # then put your Anthropic API key in .env
npm start                   # or: node server.js
```

Open <http://127.0.0.1:8000>.

Requires Node 18+ (uses the built-in `fetch`). No dependencies, no `npm install`.

Without a key, the Structures and Topics libraries work fully; only **Generate** returns
"ANTHROPIC_API_KEY is not configured on the server."

## API key

The key lives only in `.env`, read only by `server.js`, and is sent only to
`api.anthropic.com`. It never appears in `index.html`, `app.js`, any browser JavaScript,
or `localStorage`. `.env` is git-ignored.

## Files

| File | Role |
|---|---|
| `index.html`, `app.js`, `styles.css` | the browser app |
| `seed-topics.js` | starter topics (first run only) |
| `storage.js` | `localStorage` persistence + export/import |
| `server.js` | static file server + `POST /api/generate` proxy |
| `prompts.js` | internal prompt assembly (server-side only) |
| `.env` | your API key (git-ignored) |
