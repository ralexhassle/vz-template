export enum METHODS {
  Get = "GET",
  Put = "PUT",
  Patch = "PATCH",
  Delete = "DELETE",
  Post = "POST",
  Head = "HEAD",
}

export const RESOURCES = {} as const;

export const DOMAINS = {} as const;

export const ERRORS = {
  UNAUTHORIZED: {
    name: "CLIENT_ERROR",
    message: "UNAUTHORIZED",
  },
  NOT_FOUND: {
    name: "CLIENT_ERROR",
    message: "RESOURCE_NOT_FOUND",
  },
  FORBIDDEN: {
    name: "CLIENT_ERROR",
    message: "FORBIDDEN",
  },
  UNKNOWN: {
    name: "CLIENT_ERROR",
    message: "UNKNOWN_ERROR",
  },
  NOT_HANDLED: {
    name: "CLIENT_ERROR",
    message: "STATUS_NOT_HANDLED",
  },
};
