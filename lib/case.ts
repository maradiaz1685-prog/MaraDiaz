type AnyRecord = Record<string, unknown>;

export function toSnakeCase(obj: AnyRecord): AnyRecord {
  const out: AnyRecord = {};
  for (const [key, value] of Object.entries(obj)) {
    const snake = key.replace(/[A-Z]/g, (m) => "_" + m.toLowerCase());
    out[snake] = value;
  }
  return out;
}

export function toCamelCase(obj: AnyRecord): AnyRecord {
  const out: AnyRecord = {};
  for (const [key, value] of Object.entries(obj)) {
    const camel = key.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase());
    out[camel] = value;
  }
  return out;
}
