import { h, renderSlots } from '../../lib/guide-mini-vue.esm.js';

export const Foo = {
  setup() {
    return {};
  },
  render() {
    const foo = h('p', {}, 'foo');
    // Foo .vnode .children
    console.log(this.slots);
    // children -> vnode

    // renderSlots

    return h('div', {}, [foo, renderSlots(this.$slots)]);
  },
};
