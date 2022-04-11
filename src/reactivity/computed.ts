import { ref } from "./ref";
import { ReactiveEffect } from './effect'
// export function computed(fn) {
//   return ref(fn())
// }

class computedRefImpl {
  private _getter: any;
  private _dirty: boolean = true;
  private _value: any;
  private _effect: any;


  constructor(getter) {
    this._getter = getter
    this._effect = new ReactiveEffect(getter, () => {
      if (!this._dirty) return this._dirty = true
    })
  }
  get value() {
    if (this._dirty) {
      this._dirty = false
      this._value = this._effect.run()
    }
    return this._value
  }
}
export function computed(getter) {
  return new computedRefImpl(getter)
}