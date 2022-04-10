import { readonly, isReadonly, isProxy } from "../reactive"
describe("readonly", () => {
  it("should make nested values readonly", () => {
    const original = { foo: 1, bar: { baz: 2 } }
    const warpped = readonly(original)
    expect(warpped).not.toBe(original)
    expect(isReadonly(warpped)).toBe(true)
    expect(isReadonly(original)).toBe(false)
    warpped.foo = warpped.foo + 1
    expect(warpped.foo).toBe(1)
    expect(isProxy(warpped)).toBe(true)
  })
  it("should call  console.warn then set", () => {
    console.warn = jest.fn()
    const user = readonly({
      age: 10
    })
    user.age = 11
    expect(console.warn).toBeCalled()
  })
})