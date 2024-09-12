import {
  unionGenericsSymbol,
  unionVariantsSymbol,
  variantsListSymbol,
  variantTagSymbol
} from './utils/symbols'
import { ObjectFunction } from './utils/any-function'
import {
  ExtendReturnType,
  ObjectToConstructorFunction
} from './utils/type-utils'
import { G1, G2, G3, GetExtendedType, InjectGeneric } from './utils/generics'

export interface VariantDescriptor<UnionVariants> {
  [variantTagSymbol]: string
  [variantsListSymbol]: {
    [K in keyof UnionVariants]: UnionVariants[K] extends ObjectFunction<
      any,
      infer R
    >
      ? R
      : UnionVariants[K]
  }
}

export type VariantConstructorsRecord = Record<string, object | ObjectFunction>

type UnionGenericsList =
  | [typeof G1<any>]
  | [typeof G1<any>, typeof G2<any>]
  | [typeof G1<any>, typeof G2<any>, typeof G3<any>]

type UnionVariants<T> = { [unionVariantsSymbol]: T }
type UnionGenerics<T> = { [unionGenericsSymbol]: T }
type GetUnionVariants<T> =
  T extends UnionVariants<infer Variants> ? Variants : never
type GetUnionGenerics<T> =
  T extends UnionGenerics<infer Variants> ? Variants : never

type CreateUnion<
  Variants extends VariantConstructorsRecord,
  Generics extends UnionGenericsList | [unknown, unknown, unknown] = [
    unknown,
    unknown,
    unknown
  ]
> =
  VariantDescriptor<Variants> extends infer Descriptor
    ? {
        [K in keyof Variants]: ExtendReturnType<
          ObjectToConstructorFunction<Variants[K]>,
          Descriptor
        >
      } extends infer VariantsWithDescriptors
      ? {
          [K in keyof VariantsWithDescriptors]: InjectGeneric<
            VariantsWithDescriptors[K],
            GetExtendedType<Generics>
          >
        } & UnionVariants<VariantsWithDescriptors> &
          UnionGenerics<GetExtendedType<Generics>>
      : never
    : never

export type UnionType<
  Union extends UnionVariants<Record<string, ObjectFunction>> &
    UnionGenerics<any[]>,
  Generics extends GetUnionGenerics<Union> = GetUnionGenerics<Union>
> = {
  [K in keyof GetUnionVariants<Union>]: InjectGeneric<
    ReturnType<GetUnionVariants<Union>[K]>,
    Generics
  >
} extends infer Variants
  ? Variants[keyof Variants]
  : never

export type UnionConstructor = {
  <const Variants extends VariantConstructorsRecord>(
    variants: Variants
  ): CreateUnion<Variants>
  <
    const Generics extends UnionGenericsList,
    const Variants extends VariantConstructorsRecord
  >(
    generics: Generics,
    variants: Variants
  ): CreateUnion<Variants, Generics>
}

type WithOrElse<T extends object> = T & { orElse: () => any }

export interface VariantMatcher {
  <
    const Value extends VariantDescriptor<any>,
    Variants extends Value[typeof variantsListSymbol],
    Matchers extends
      | WithOrElse<{
          [K in keyof Partial<Variants>]: (value: Variants[K]) => any
        }>
      | {
          [K in keyof Variants]: (value: Variants[K]) => any
        }
  >(
    value: Value,
    matchers: Matchers
  ): ReturnType<Exclude<Matchers[keyof Matchers], undefined>>
}
