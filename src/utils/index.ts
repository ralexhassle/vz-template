export function assert<T>(
  subject: T | null | undefined,
  errorMessage = "UNKNOWN_ERROR"
): asserts subject is T {
  if (subject == null) {
    throw new Error(errorMessage);
  }
}

export function isDefined<T>(value: T | undefined | null): value is T {
  return typeof value !== "undefined" && value !== null;
}

export function isString(value: unknown): value is string {
  return typeof value === "string";
}

export function isObject(value: unknown): value is object {
  return typeof value === "object";
}

export function isError(error: unknown): error is Error {
  return error instanceof Error;
}

export function isEqual(a: string, b: string) {
  return a === b;
}
