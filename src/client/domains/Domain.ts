import Session from "../Session";

import type { DomainInit } from "../types";

type Params = Record<string, string | number | boolean | undefined>;

class Domain {
  readonly session: Session;

  constructor(domainInit: DomainInit) {
    this.session = domainInit.session;
  }

  static createResource(...resources: string[]): string {
    return resources.join("/");
  }

  static createQueryString(params: Params): string {
    return Object.keys(params)
      .filter((key) => typeof params[key] !== "undefined")
      .map((key) => `${key}=${encodeURIComponent(params[key] as string)}`)
      .join("&");
  }

  static createQueryParams(resource: string, params: Params): string {
    return `${resource}?${this.createQueryString(params)}`;
  }
}

export default Domain;
