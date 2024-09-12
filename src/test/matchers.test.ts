import { Union } from '../union'
import { is, isSameUnion, isUnion, when } from '../matchers'

describe('union matchers', () => {
  const TestUnion = Union({
    Some: { value: true },
    None: { value: false }
  })

  describe('when', () => {
    it('should correctly match value with provided variants', () => {
      const variants = {
        Some: ({ value }: any) => value,
        None: ({ value }: any) => value
      }

      expect(when(TestUnion.Some(), variants)).toBe(true)
      expect(when(TestUnion.None(), variants)).toBe(false)
    })
    it('should fall back to orElse case in non-exhaustive matching', () => {
      expect(
        when(TestUnion.None(), {
          Some: ({ value }: any) => value,
          orElse: () => null
        })
      ).toBe(null)
    })
  })
  describe('is', () => {
    it('should correctly match value with provided variant by name', () => {
      expect(is(TestUnion.Some(), 'Some')).toBe(true)
      expect(is(TestUnion.Some(), 'None')).toBe(false)
    })
  })
  describe('isUnion', () => {
    it('should tell if value is a union', () => {
      expect(isUnion(TestUnion)).toBe(true)
      expect(isUnion({})).toBe(false)
    })
  })
  describe('isSameUnion', () => {
    it('should two values are the same union', () => {
      expect(isSameUnion(TestUnion, TestUnion)).toBe(true)
      expect(isSameUnion(TestUnion, Union({ Test1: { value: 1 } }))).toBe(false)
    })
  })
})
