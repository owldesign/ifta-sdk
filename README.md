# IFTA SDK

Typed, ESM-first JavaScript/TypeScript client for the Truker IFTA REST API, generated from the public OpenAPI spec.

## Installation

```bash
npm install ifta-sdk
```

## Quick start

```ts
import { createIftaClient } from "ifta-sdk";

const client = createIftaClient({
  token: process.env.IFTA_API_TOKEN,
  // baseUrl defaults to https://truker.app
});

const periods = await client.listPeriods();
const period = await client.getPeriod("1Q2024");
const rates = await client.listRates({ quarter: "1Q2024", country: "US", changed: true });
```

## API

### `createIftaClient(options?)`
Creates an `IftaClient` instance.

Options:
- `baseUrl` – override API base (default: `https://truker.app`).
- `token` – bearer token with the `ifta.read` ability.
- `fetch` – custom fetch implementation (falls back to `globalThis.fetch`).

### Client methods
- `listPeriods(init?)` → `PaginatedPeriods`
- `getPeriod(quarter, init?)` → `PeriodDetail`
- `listRates(params?, init?)` → `PaginatedRates`

Each method accepts an optional `RequestInit` to pass headers, signal, etc.

### Types
All response shapes are exported: `PeriodSummary`, `PeriodDetail`, `RateResource`, `Footnote`, `FuelType`, `Jurisdiction`, `PaginatedPeriods`, `PaginatedRates`, `RatesQuery`, and supporting pagination types.

### Errors
Non-2xx responses throw `HttpError` with `status`, `statusText`, and parsed `body` (JSON when available).

## Development

- Build: `npm run build`
- OpenAPI source: `openapi.json` (downloaded from https://ifta-api.truker.app/openapi.json)

Author: [Vadim Goncharov](https://github.com/owldesign)
