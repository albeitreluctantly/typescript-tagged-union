import { VariantConstructorsRecord } from './types'
import { isObject } from './utils/type-checkers'
import { unionDescriptorSymbol, variantTagSymbol } from './utils/symbols'
import { ObjectFunction } from './utils/any-function'

export const getUnionDescriptor = (value: unknown) =>
  isObject(value) && value[unionDescriptorSymbol]

export const getVariantTag = (variant: unknown) =>
  isObject(variant) && variant[variantTagSymbol]
