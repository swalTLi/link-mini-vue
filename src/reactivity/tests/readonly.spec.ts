import { readonly } from "../reactive"
describe("readonly", () => {
  it("happy path", () => {
    const original = { foo: 1, bar: { baz: 2 } }
    const warpped = readonly(original)
    expect(warpped).not.toBe(original)
    warpped.foo = warpped.foo + 1
    expect(warpped.foo).toBe(1)
  })
  it("warn then call set", () => {
    console.warn = jest.fn()
    const user = readonly({
      age: 10
    })
    user.age = 11
    expect(console.warn).toBeCalled()
  })
})