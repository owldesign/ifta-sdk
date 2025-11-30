import type {
  PaginatedPeriods,
  PeriodDetail,
  PaginatedRates,
  RatesQuery,
} from "./types.js";

export interface IftaClientOptions {
  baseUrl?: string;
  token?: string;
  fetch?: typeof fetch;
}

export class HttpError extends Error {
  readonly status: number;
  readonly statusText: string;
  readonly body: unknown;

  constructor(message: string, params: { status: number; statusText: string; body: unknown }) {
    super(message);
    this.name = "HttpError";
    this.status = params.status;
    this.statusText = params.statusText;
    this.body = params.body;
  }
}

export class IftaClient {
  private readonly baseUrl: string;
  private readonly token?: string;
  private readonly fetchImpl: typeof fetch;

  constructor(options: IftaClientOptions = {}) {
    this.baseUrl = options.baseUrl ?? "https://truker.app";
    this.token = options.token;
    this.fetchImpl = options.fetch ?? globalThis.fetch;

    if (!this.fetchImpl) {
      throw new Error("Fetch API is not available. Provide a fetch implementation in IftaClientOptions.");
    }
  }

  /**
   * List IFTA periods (paginated)
   */
  async listPeriods(init?: RequestInit): Promise<PaginatedPeriods> {
    return this.request<PaginatedPeriods>("/api/v1/periods", { init });
  }

  /**
   * Fetch a single period by quarter code (e.g., "1Q2024")
   */
  async getPeriod(quarter: string, init?: RequestInit): Promise<PeriodDetail> {
    if (!quarter) {
      throw new Error("quarter is required");
    }

    const path = `/api/v1/periods/${encodeURIComponent(quarter)}`;
    return this.request<PeriodDetail>(path, { init });
  }

  /**
   * List rates with optional filters.
   */
  async listRates(params: RatesQuery = {}, init?: RequestInit): Promise<PaginatedRates> {
    return this.request<PaginatedRates>("/api/v1/rates", { query: params, init });
  }

  private async request<T>(path: string, options: { query?: Record<string, unknown>; init?: RequestInit }): Promise<T> {
    const url = new URL(path, this.baseUrl);

    if (options.query) {
      for (const [key, value] of Object.entries(options.query)) {
        if (value === undefined || value === null) continue;
        url.searchParams.set(key, typeof value === "boolean" ? String(value) : `${value}`);
      }
    }

    const headers = new Headers(options.init?.headers);
    headers.set("Accept", "application/json");
    if (this.token) {
      headers.set("Authorization", `Bearer ${this.token}`);
    }

    const response = await this.fetchImpl(url.toString(), {
      ...options.init,
      headers,
    });

    const contentType = response.headers.get("content-type") ?? "";
    const isJson = contentType.includes("application/json");
    const body = isJson ? await response.json() : await response.text();

    if (!response.ok) {
      throw new HttpError(`Request failed with status ${response.status}`, {
        status: response.status,
        statusText: response.statusText,
        body,
      });
    }

    return body as T;
  }
}

export const createIftaClient = (options?: IftaClientOptions): IftaClient => new IftaClient(options);
