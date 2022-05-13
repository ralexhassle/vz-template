import HttpStatus from "http-status-codes";
import { METHODS, ERRORS } from "./constants";

import type { ClientResponse } from "./types";

async function request<T>(
  endpoint: RequestInfo,
  init: RequestInit
): ClientResponse<T> {
  try {
    const response = await fetch(endpoint, init);

    if (init.method === METHODS.Head) {
      switch (response.status) {
        case HttpStatus.NOT_FOUND: {
          return { error: ERRORS.NOT_FOUND, data: null };
        }
        case HttpStatus.FORBIDDEN: {
          return { error: ERRORS.FORBIDDEN, data: null };
        }
        case HttpStatus.UNAUTHORIZED: {
          return { error: ERRORS.UNAUTHORIZED, data: null };
        }
        case HttpStatus.NO_CONTENT: {
          return { error: null, data: null };
        }
        default: {
          return { error: ERRORS.NOT_HANDLED, data: null };
        }
      }
    }

    switch (response.status) {
      case HttpStatus.OK:
      case HttpStatus.CREATED: {
        const data = (await response.json()) as T;
        return { error: null, data };
      }
      case HttpStatus.BAD_REQUEST:
      case HttpStatus.UNAUTHORIZED:
      case HttpStatus.CONFLICT:
      case HttpStatus.FORBIDDEN:
      case HttpStatus.NOT_FOUND: {
        const data = (await response.json()) as { error: API.Error };
        return { error: data.error, data: null };
      }
      case HttpStatus.NO_CONTENT: {
        return { error: null, data: null };
      }
      default: {
        return { error: ERRORS.NOT_HANDLED, data: null };
      }
    }
  } catch (e) {
    return { error: ERRORS.UNKNOWN, data: null };
  }
}

export default request;
