<h1>typescript-tagged-union</h1>

<p>A library that adds tagged union data structure support to TypeScript.</p>
<p>It allows to define strictly typed union data structures, with full support for generics, and match them with built-in matcher utilities.</p>
<p>The library uses simple Javascript by attaching symbolic variant tag properties to the resulting objects and comparing them, and some forbidden arts of TypeScript, to achieve full generics support in particular.</p>

<h2>Example usage</h2>
<h3>Basic</h3>
<p>Create a union with "Union" utility function.</p>
<p>You have an option to declare union variants with objects, or with constructor functions.</p>
<i>Use "as const" or type assertions for strict typing if necessary.</i>
<p>Union variant instance types are declared simply with "ReturnType" of their constructors.</p>
<p>Variant instances intersection type can be declared as an intersection of its variants' types or with "UnionType" utility.</p>

```ts
const Theme = Union({
  Light: { colors: { background: '#fff', text: { primary: '#000' } } },
  Dark: { colors: { background: '#000', text: { primary: '#fff' } } },
})

type Light = ReturnType<typeof Theme.Light>
type Dark = ReturnType<typeof Theme.Light>

type ThemeOption1 = UnionType<typeof Theme>
type ThemeOption2 = Light | Dark

const lightTheme: Theme1 = Theme.Light()
```
```ts
const Color = Union({
  RGB: (r, g, b) => `rgb(${r}, ${g}, ${b})`,
  HSL: (h, s, l) => `hsl(${h}, ${s}, ${l})`,
})

type Color = UnionType<typeof Color>
```
<h3>With generics</h3>
<p>Unlike common types, generics are defined with G1/2/3 utils which serve for carrying generics into the resulting types of a union constructor.</p>
<p>Define a set of generics as the first argument and place corresponding generics as type of the generic arguments you need to use.</p>
<p>To declare that a generic must extend some value, set it as a generic argument for a G util.</p>

<details>
<summary>Author's word</summary>
<p>This usage looks quite quirky and unusual, i had to resort to some creativity and typescript sorcery to implement support for generics, with the language placing obstacles all over the way, and make the usage look neatly and aesthetically enough.</p>

<p><i>The types' internals are not a bit aesthetical though, they're quite monstrous, contrarily, hope they won't break into some parallel reality in some tricky edge case)</i></p>

<p>It would all look better with native support for preserving generics of the functions defined as object methods, preserving generics in return type or partial generic arguments inference.</p>
<p>But we have what we have and the current implementation is what i could come up with as a simple and intuitive enough way.</p>
<p>This might not tally with your sense of beauty, any better ideas are welcome.</p>
</details>

<p><i>Don't perceive this example of Either as "production ready", one would actually rather use classes for Left and Right.</i></p>

```ts
const Either = Union([G1, G2], {
  Left: (value: G1) => ({ value, isLeft: true, isRight: false }) as const,
  Right: (value: G2) => ({ value, isLeft: false, isRight: true }) as const
})

type Left<L, R> = ReturnType<typeof Either.Left<L, R>>
type Right<L, R> = ReturnType<typeof Either.Right<L, R>>

type Either<L, R> = UnionType<typeof Either, [L, R]>
```
```ts
const DataState = Union([G1<Error>, G2], {
  Initial: { data: null, error: null, loading: false } as const,
  Loading: { data: null, error: null, loading: true } as const,
  Error: (error: G1, loading: boolean = false) => ({
    data: null,
    error,
    loading: loading
  }),
  Loaded: (data: G2, loading: boolean = false) => ({
    data,
    error: null,
    loading: loading
  })
})

type DataState<E extends Error, T> = UnionType<typeof DataState, [E, T]>
```

<h3>Matching</h3>
<p>Use "when" utility to match a with multiple variants of the union. You can use exhaustive, or non-exhaustive matching with "orElse".</p>

```ts
const value: DataState<Error, number> = DataState.Loaded(1)

// string | number | null
const resultExhaustive = when(value, {
  Loaded: ({ data }) => data.toFixed(),
  Error: ({ error }) => error.message,
  Loading: () => null,
  Initial: () => null,
})

const result = when(value, {
  Loaded: ({ data }) => data.toFixed(),
  Error: ({ error }) => error.message,
  orElse: () => null
})
```

<p>Use "is" to match with a particular variant tag.</p>

```ts
const toLowerCase = (value: Either<Error, string>) => {
  return is(value, 'Right') && value.value.toLowerCase()
}
```
