import { ObjectFunction } from './any-function'

export type ObjectToConstructorFunction<T extends object | ObjectFunction> =
  T extends ObjectFunction ? T : ObjectFunction<any[], T>

export type ExtendReturnType<T extends ObjectFunction, Add> =
  T extends ObjectFunction<infer A, infer R>
    ? ObjectFunction<A, R & Add>
    : never
