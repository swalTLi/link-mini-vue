import { ShapeFlags } from "../shared/ShapeFlags";

export function initSlots(instance, children) {
  const { vnode } = instance
  if (vnode.shapeFlag & ShapeFlags.SLOT_CHILDREN)
    normalizeSlotValues(children, instance.slots)
}

export function normalizeSlotValues(children: any, slots: any) {
  // const slots = {}
  for (const key in children) {
    const value = children[key]
    slots[key] = props => normalizeSlotValue(value(props))
  }
}

function normalizeSlotValue(value) {
  return Array.isArray(value) ? value : [value]
}
