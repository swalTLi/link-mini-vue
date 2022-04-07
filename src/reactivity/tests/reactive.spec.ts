import { reactive } from "../reactive"
describe('reactive', () => {
  it.skip("happy path ", () => {
    const original = { foo: 1, age: 2 }
    const observe = reactive(original)
    expect(original).not.toBe(observe)
    observe.foo++
    expect(observe.foo).toBe(2)
  })
})