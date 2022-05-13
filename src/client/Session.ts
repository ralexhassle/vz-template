import { v4 as UUID } from "uuid";

import request from "./request";
import { METHODS } from "./constants";
import { STORAGE } from "./storage";

import type { Request, ClientResponse, SessionConfig } from "./types";
import type { PersistedKey } from "./storage";

class Session {
  server: string;

  clientUID: string;

  constructor(config: SessionConfig) {
    const { server } = config;
    this.server = server;
    this.clientUID = Session.getClientUID();
    Session.persist(STORAGE.CLIENT_UID, this.clientUID);
  }

  static getClientUID(): string {
    const clientUID = Session.restore<string | null>(STORAGE.CLIENT_UID, null);
    return clientUID !== null ? clientUID : UUID();
  }

  public async request<T>(req: Request): ClientResponse<T> {
    const server = req.server || this.server;
    const endpoint = Session.createEndpoint(server, req.resource);

    const init: RequestInit = {
      method: req.method,
      body: Session.createBody(req.body, req.isMultipart),
      headers: Session.createHeaders(req),
    };

    const result = await request<T>(endpoint, init);

    return result;
  }

  static createEndpoint(base: string, ...resources: string[]): string {
    return base.slice(-1) === "/"
      ? `${base}${resources.join("/")}`
      : `${base}/${resources.join("/")}`;
  }

  static createResource(...resources: string[]): string {
    return resources.join("/");
  }

  static createHeaders(req: Request): Headers {
    const headers = new Headers();

    if (req.token) {
      headers.append("Authorization", `Bearer ${req.token}`);
    }

    if (!req.isMultipart && req.body) {
      headers.append("Content-Type", "application/json");
    }

    switch (req.method) {
      case METHODS.Post: {
        headers.append("Accept", "application/json");
        return headers;
      }
      case METHODS.Put: {
        headers.append("Accept", "application/json");
        return headers;
      }
      case METHODS.Patch: {
        headers.append("Accept", "application/json");
        return headers;
      }
      case METHODS.Head: {
        headers.append("Content-Type", "application/json");
        return headers;
      }
      case METHODS.Get: {
        return headers;
      }
      default:
        return headers;
    }
  }

  static createBody(body?: API.Body, isMultipart?: boolean): string | FormData {
    if (isMultipart && body) {
      const formData = new FormData();

      Object.entries(body).forEach(([key, value]) => {
        formData.append(key, value);
      });

      return formData;
    }
    return JSON.stringify(body);
  }

  static serialize<T>(value: T): string {
    return JSON.stringify(value);
  }

  static deserialize<T>(value: string): T {
    return JSON.parse(value) as T;
  }

  static persist<T>(key: PersistedKey, value: T): void {
    const serializedValue = Session.serialize(value);
    localStorage.setItem(key, serializedValue);
  }

  static restore<T>(key: PersistedKey, defaultValue: T): T {
    const item: string | null = localStorage.getItem(key);
    return item ? Session.deserialize<T>(item) : defaultValue;
  }

  static remove(key: PersistedKey): void {
    const item: string | null = localStorage.getItem(key);

    if (item !== null) {
      localStorage.removeItem(key);
    }
  }
}

export default Session;
