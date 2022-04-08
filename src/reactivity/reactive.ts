import { reactiveHandler, readonlyHandler } from './baseHandlers'

export const enum ReactiveFlags {
  IS_REACTIVE = "__v_isReactive",
  IS_READONLY = "__v_isReadonly"
}

export function reactive(raw) {
  return createReactiveObject(raw, reactiveHandler)
}
export function readonly(raw) {
  return createReactiveObject(raw, readonlyHandler)
}

export function isReactive(value) {
  return !!value[ReactiveFlags.IS_REACTIVE]
}

export function isReadonly(value) {
  return !!value[ReactiveFlags.IS_READONLY]
}

function createReactiveObject(target, baseHandlers) {
  return new Proxy(target, baseHandlers)
}