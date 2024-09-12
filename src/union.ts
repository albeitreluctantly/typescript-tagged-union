import { UnionConstructor, VariantConstructorsRecord } from './types'
import { isObject } from './utils/type-checkers'
import { unionDescriptorSymbol, variantTagSymbol } from './utils/symbols'
import { ObjectFunction } from './utils/any-function'

export const Union: UnionConstructor = (...args: any[]) => {
  const variants = [args[0], args[1]].find(isObject)

  if (!variants) {
    throw new Error('Variants list is not an object')
  }

  return createUnion(variants) as any
}

const createUnion = (variants: VariantConstructorsRecord) => {
  const union = Object.fromEntries(
    Object.entries(variants).map(([variantName, variantData]) => {
      const variantConstructor = isObject(variantData)
        ? () => variantData
        : (variantData as ObjectFunction)

      return [
        variantName,
        (...args: any[]) => {
          const result = variantConstructor(...args)

          defineInternalProperty(result, variantTagSymbol, variantName)

          return result
        }
      ]
    })
  )

  defineInternalProperty(union, unionDescriptorSymbol, Symbol())

  return union
}

const defineInternalProperty = (
  target: object,
  name: string | symbol,
  value: any
) =>
  Object.defineProperty(target, name, {
    enumerable: false,
    value,
    configurable: false,
    writable: false
  })
