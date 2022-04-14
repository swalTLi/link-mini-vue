import { track, trigger } from "./effect"
import { reactive, ReactiveFlags, readonly } from "./reactive"
import { isObject, extend } from "../shared/index"
const get = createGetter()
const set = createSetter()
const readonlyGet = createGetter(true)
const readonlySet = createSetter(true)
const shallowReadonlyGet = createGetter(true, true)
// const shallowReadonlySet = createGetter(true, true)

function createGetter(isReadonly = false, shallow = false) {
  return function get(target, key) {

    if (key === ReactiveFlags.IS_REACTIVE) return !isReadonly
    if (key === ReactiveFlags.IS_READONLY) return isReadonly

    const res = Reflect.get(target, key)

    if (shallow) return res

    // 看看res 是不是 Object
    if (isObject(res)) return isReadonly ? readonly(res) : reactive(res)

    // TODO 依赖收集
    if (!isReadonly) track(target, key)

    return res
  }
}
function createSetter(isReadonly = false) {
  return function set(target, key, value) {
    // TODO 触发依赖
    if (!isReadonly) {
      const res = Reflect.set(target, key, value)
      trigger(target, key)
      return res
    } else {
      console.warn(`key: '${key}' set faild ,because 'target' is readonly`, target)
      return true
    }
  }
}

export const reactiveHandlers = {
  get,
  set,
}
export const readonlyHandlers = {
  get: readonlyGet,
  set: readonlySet,
}
export const shallowReadonlyHandlers = extend({}, readonlyHandlers, {
  get: shallowReadonlyGet,
  // set: shallowReadonlySet
})