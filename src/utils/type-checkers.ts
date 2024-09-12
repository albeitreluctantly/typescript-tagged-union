export const isObject = (a: unknown): a is { [key: string | symbol]: any } =>
  !!a && a.constructor === Object
