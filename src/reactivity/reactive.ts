import { reactiveHandler, readonlyHandler } from './baseHandlers'

export function reactive(raw) {
  return new Proxy(raw, reactiveHandler)
}
export function readonly(raw) {
  return new Proxy(raw, readonlyHandler)
}