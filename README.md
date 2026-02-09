# Header Inspector

A simple HTTP API that returns the request headers and HTTP version sent by the client. Useful for debugging and inspecting what headers your browser or HTTP client is sending.

Live at [https://headers.oboesax.com](https://headers.oboesax.com)

## Usage

Send a GET request to `/` and receive a JSON response containing your headers and HTTP version:

```json
{
  "headers": {
    "host": "headers.oboesax.com",
    "user-agent": "curl/8.1.2",
    "accept": "*/*"
  },
  "httpVersion": "1.1"
}
```

## Setup

```bash
npm install
cp .env.example .env
```

Edit `.env` to configure your environment (see [Configuration](#configuration)).

## Running

```bash
# Production
npm start

# Development (auto-reload on file changes)
npm run dev
```

## Configuration

Environment variables are loaded from a `.env` file via [dotenv](https://www.npmjs.com/package/dotenv). See `.env.example` for a template.

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Port the server listens on | `3000` |
| `CORS_ORIGINS` | Comma-separated list of additional allowed CORS origins | _(none)_ |

### CORS

`http://localhost:3000` is always allowed. Additional origins can be added via the `CORS_ORIGINS` environment variable:

```env
CORS_ORIGINS=http://localhost:3050,https://headers.oboesax.com
```

## License

See [LICENSE](LICENSE) for details.
