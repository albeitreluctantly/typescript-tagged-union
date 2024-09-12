import { AnyFunction } from './any-function'

declare const genericDescriptor: unique symbol
declare const genericDescriptor2: unique symbol
declare const genericDescriptor3: unique symbol

declare const genericTagSymbol: unique symbol

type GenericTag<T> = { [genericTagSymbol]: T }

export type G1 = GenericTag<typeof genericDescriptor>
export type G2 = GenericTag<typeof genericDescriptor2>
export type G3 = GenericTag<typeof genericDescriptor3>

const notCallable = () => {
  throw new Error('This function is a type carrier util, it is not callable')
}

export const G1: <T>(arg: T) => G1 = notCallable

export const G2: <T>(arg: T) => G2 = notCallable

export const G3: <T>(arg: T) => G3 = notCallable

export type GetExtendedType<T> = T extends typeof G1<infer A>
  ? A
  : T extends typeof G2<infer B>
    ? B
    : T extends typeof G3<infer C>
      ? C
      : T extends [infer First, ...infer Rest]
        ? [GetExtendedType<First>, ...GetExtendedType<Rest>]
        : T

export type InjectGeneric<
  T,
  Generics extends unknown[],
  A extends Generics[0] = Generics[0],
  B extends Generics[0] = Generics[1],
  C extends Generics[0] = Generics[2]
> = T extends G1
  ? A
  : T extends G2
    ? B
    : T extends G3
      ? C
      : T extends AnyFunction<infer Args, infer Return>
        ? Generics['length'] extends 0
          ? (
              ...args: InjectGeneric<Args, Generics>
            ) => InjectGeneric<Return, Generics>
          : Generics['length'] extends 1
            ? <A1 extends A>(
                ...args: InjectGeneric<Args, [A1]>
              ) => InjectGeneric<Return, [A1]>
            : Generics['length'] extends 2
              ? <A1 extends A, A2 extends B>(
                  ...args: InjectGeneric<Args, [A1, A2]>
                ) => InjectGeneric<Return, [A1, A2]>
              : <A1 extends A, A2 extends B, A3 extends C>(
                  ...args: InjectGeneric<Args, [A1, A2, A3]>
                ) => InjectGeneric<Return, [A1, A2, A3]>
        : T extends [infer First, ...infer Rest]
          ? [InjectGeneric<First, Generics>, ...InjectGeneric<Rest, Generics>]
          : T extends object
            ? { [K in keyof T]: InjectGeneric<T[K], Generics> }
            : T extends Set<infer A>
              ? Set<InjectGeneric<A, Generics>>
              : T extends Map<infer K, infer V>
                ? Map<InjectGeneric<K, Generics>, InjectGeneric<V, Generics>>
                : T
