import { track, trigger } from "./effect"

const get = createGetter()
const set = createSetter()
const readonlyGet = createGetter(true)
const readonlySet = createSetter(true)

function createGetter(isReadonly = false) {
  return function get(target, key) {
    const res = Reflect.get(target, key)
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

export const reactiveHandler = {
  get,
  set,
}
export const readonlyHandler = {
  get: readonlyGet,
  set: readonlySet,
}