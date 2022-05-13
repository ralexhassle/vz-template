import Session from "./Session";

import { METHODS } from "./constants";

export interface SessionConfig {
  server: string;
}

export interface Request {
  method: Method;
  server?: string;
  body?: API.Body;
  token?: string | null;
  resource: string;
  isMultipart?: boolean;
  isNested?: boolean;
}

export interface RequestParams {
  method: Method;
  endpoint: string;
  body?: string | FormData;
  headers: HeadersInit;
  encryptionKey?: string;
}

export interface ErrorDetail {
  field: string;
  message: string;
}

export interface ClientError {
  name: string;
  message: string;
  details?: ErrorDetail[];
}

export interface ClientResponseSuccess<T> {
  error: null;
  data: T;
}

export interface ClientResponseNoContentSuccess {
  error: null;
  data: null;
}

export interface ClientResponseFailure {
  error: ClientError;
  data: null;
}

export type ClientResponse<T> = Promise<
  | ClientResponseSuccess<T>
  | ClientResponseFailure
  | ClientResponseNoContentSuccess
>;

export type Method = `${METHODS}`;

export interface DomainInit {
  session: Session;
}
