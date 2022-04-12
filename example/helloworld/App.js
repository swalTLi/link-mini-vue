import { h } from '../../lib/guide-mini-vue.esm.js';

export const App = {
  // 必须要写 render
  render() {
    // ui
    return h(
      'div',
      {
        id: 'root',
        class: ['red', 'hard'],
      },
      // 'hi, ' + this.msg
      [
        h('p', { id: 'p1', class: ['p', 'p1'] }, 'this is p1 about mini-vue'),
        h('p', { id: 'p2', class: ['p', 'p2'] }, 'this is p2 about mini-vue'),
      ]
    );
  },

  setup() {
    return {
      msg: 'mini-vue',
    };
  },
};
