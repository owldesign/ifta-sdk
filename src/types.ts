export type Country = "US" | "CAN";

export interface PaginationLinks {
  first: string | null;
  last: string | null;
  prev: string | null;
  next: string | null;
}

export interface PaginationMeta {
  current_page: number;
  from: number | null;
  last_page: number;
  path: string;
  per_page: number;
  to: number | null;
  total: number;
}

export interface PeriodSummary {
  id: number;
  quarter: string;
  title: string | null;
  link: string | null;
  exchange_rate: string | null;
  published_at: string | null;
  rates_count: number;
  footnotes_count: number;
}

export interface Footnote {
  id: number;
  period_id: number;
  jurisdiction_id: number | null;
  code: string;
  content: string;
}

export interface Jurisdiction {
  id: number;
  code: string;
  country: Country;
  external_id: string | null;
  effective_date: string | null;
  surcharge: number | null;
}

export interface FuelType {
  id: number;
  name: string;
}

export interface RateResource {
  id: number;
  period_id: number;
  jurisdiction_id: number;
  fuel_type_id: number;
  country: Country;
  rate: number;
  rate_change: boolean;
  created_at: string | null;
  updated_at: string | null;
  period: PeriodSummary;
  jurisdiction: Jurisdiction;
  fuelType: FuelType;
}

export interface PeriodDetail extends PeriodSummary {
  rates: RateResource[];
  footnotes: Footnote[];
}

export interface PaginatedPeriods {
  data: PeriodSummary[];
  links: PaginationLinks;
  meta: PaginationMeta;
}

export interface PaginatedRates {
  data: RateResource[];
  links: PaginationLinks;
  meta: PaginationMeta;
}

export interface UnauthorizedResponse {
  message?: string;
}

export interface RatesQuery {
  quarter?: string;
  country?: Country;
  jurisdiction?: string;
  fuel_type?: string;
  changed?: boolean;
  [key: string]: string | boolean | Country | undefined;
}
