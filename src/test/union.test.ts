import { Union } from '../union'
import { isUnion, isUnionVariant } from '../matchers'
import { G1, G2 } from '../utils/generics'

const assertUnionCorrectness = (TestUnion: any) => {
  expect(isUnion(TestUnion)).toBe(true)
  expect(isUnionVariant(TestUnion.Test1())).toBe(true)
  expect(isUnionVariant(TestUnion.Test2())).toBe(true)
}

describe('union', () => {
  it('should create a correct union of variants declared as objects', () => {
    const TestUnion = Union({
      Test1: { data: { title: 'Test1' } },
      Test2: { data: { title: 'Test2' } }
    })

    assertUnionCorrectness(TestUnion)
    expect(TestUnion.Test1()).toEqual({ data: { title: 'Test1' } })
    expect(TestUnion.Test2()).toEqual({ data: { title: 'Test2' } })
  })
  it('should create a correct union of variants declared as functions', () => {
    const TestUnion = Union({
      Test1: (value: string) => ({
        data: {
          title: value
        }
      }),
      Test2: (value: number) => ({
        data: {
          count: value
        }
      })
    })

    assertUnionCorrectness(TestUnion)
    expect(TestUnion.Test1('Test1')).toEqual({ data: { title: 'Test1' } })
    expect(TestUnion.Test2(10)).toEqual({ data: { count: 10 } })
  })
  it('should create a correct union of variants with generics', () => {
    const TestUnion = Union([G1<string>, G2<Error>], {
      Test1: (title?: G1) => ({
        data: {
          title
        }
      }),
      Test2: (error?: G2) => ({
        data: {
          error
        }
      })
    })

    assertUnionCorrectness(TestUnion)
    const error = new Error()
    expect(TestUnion.Test1('Test1')).toEqual({ data: { title: 'Test1' } })
    expect(TestUnion.Test2(error)).toEqual({ data: { error } })
  })
})
