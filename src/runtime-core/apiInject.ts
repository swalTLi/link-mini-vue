import { getCurrentInstance } from "./component";

export function provide(key, value) {
  console.log('provide: ', key, value);

  // 存
  // key value 
  const currentInsatance: any = getCurrentInstance()
  if (currentInsatance) {
    let { provides } = currentInsatance
    const parentProvides = currentInsatance.parent.provides

    if (provides === parentProvides) {
      provides = currentInsatance.provides = Object.create(parentProvides)
    }

    provides[key] = value
  }
}

export function inject(key, defaultValue) {
  // 取
  const currentInsatance: any = getCurrentInstance()
  if (currentInsatance) {
    const parentProvides = currentInsatance.parent.provides

    if (key in parentProvides) {
      return parentProvides[key]
    } else if (defaultValue) {
      if (typeof defaultValue === "function") {
        return defaultValue()
      }
      return defaultValue
    }
  }
}