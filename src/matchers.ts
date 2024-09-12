import { variantsListSymbol } from './utils/symbols'
import {
  VariantConstructorsRecord,
  VariantDescriptor,
  VariantMatcher
} from './types'
import { getUnionDescriptor, getVariantTag } from './utils'

export const when: VariantMatcher = (value, matchers) => {
  const tag = getVariantTag(value)

  const variantKey = Object.keys(matchers).find(
    variantName => variantName === tag
  )

  if (variantKey) {
    return matchers[variantKey](value as any)
  }

  return matchers.orElse(value as any)
}

export const is = <
  Value extends VariantDescriptor<any>,
  const VariantName extends keyof Value[typeof variantsListSymbol]
>(
  value: Value,
  variantName: VariantName
): value is Value[typeof variantsListSymbol][VariantName] => {
  return getVariantTag(value) === variantName
}

export const isUnion = (value: unknown): boolean => {
  return Boolean(getUnionDescriptor(value))
}

export const isUnionVariant = (value: unknown): boolean => {
  return Boolean(getVariantTag(value))
}

export const isSameUnion = <
  ValueA extends VariantConstructorsRecord,
  ValueB extends VariantConstructorsRecord
>(
  valueA: ValueA,
  valueB: ValueB
) => {
  return (
    isUnion(valueA) && getUnionDescriptor(valueA) === getUnionDescriptor(valueB)
  )
}
