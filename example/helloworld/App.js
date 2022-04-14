import { h } from '../../lib/guide-mini-vue.esm.js';
import { Foo } from './Foo.js';
window.self = null;
export const App = {
  // 必须要写 render
  render() {
    window.self = this;
    // ui
    return h(
      'div',
      {
        id: 'root',
        class: ['red', 'hard'],
        onClick(e) {
          console.log('onClick: root');
        },
        onMousedown(e) {
          console.log('onClick: onMousedown');
        },
      },
      // 'hi, ' + this.msg
      [
        h(
          'h1',
          { id: 'h1', class: ['h1'] },
          'hi ' + this.msg + ', I am ' + this.name
        ),
        h('p', { id: 'p1', class: ['p', 'p1'] }, 'this is p1 about mini-vue'),
        h('p', { id: 'p2', class: ['p', 'p2'] }, 'this is p2 about mini-vue'),
        h(Foo, { count: 1 }),
        h('div', { id: 'p3', class: ['p', 'p2'] }, [
          h(
            'div',
            {
              id: 'p3',
              class: ['p', 'p1'],
              onClick(e) {
                console.log('onClick: p1');
                console.log(e);
              },
            },
            '$$$$$$$$$$$$'
          ),
          h(
            'div',
            {
              id: 'p3',
              class: ['p', 'p1'],
              onClick(e) {
                console.log('onClick: p1');
                console.log(e);
              },
            },
            '###########'
          ),
        ]),
      ]
    );
  },

  setup() {
    return {
      msg: 'mini-vue',
      name: 'link',
    };
  },
};
