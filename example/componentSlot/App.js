import { h, createtextVnode } from '../../lib/guide-mini-vue.esm.js';
import { Foo } from './Foo.js';
export const App = {
  name: 'App',
  render() {
    const app = h('div', {}, 'App');
    const foo = h(
      Foo,
      {},
      {
        header: ({ age }) => [
          h('p', {}, 'header' + age),
          createTextVnode('hello i am link'),
        ],
        footer: () => h('p', {}, 'footer'),
      }
    );
    return h('div', {}, [app, foo]);
  },
  setup() {},
};
