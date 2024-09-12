export interface AnyFunction<
  in ArgsType extends any[] = any[],
  out ReturnType = any
> {
  (...args: ArgsType): ReturnType
}

export interface ObjectFunction<
  A extends any[] = any[],
  R extends object = object
> extends AnyFunction<A, R> {}
