import * as Constants from "./constants";

// eslint-disable-next-line @typescript-eslint/ban-types
type Body = {};

interface ErrorDetail {
  field: string;
  message: string;
}

interface Error {
  name: string;
  message: string;
  details?: ErrorDetail[];
}

type NoContent = null;

export as namespace API;
