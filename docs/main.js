import 'regenerator-runtime/runtime';
import 'yaku/lib/global';
import Vue from 'vue';
import VueDiagramEditor from '../src';

import Codemirror from 'codemirror/lib/codemirror';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/shell/shell';
import 'codemirror/mode/vue/vue';
import 'codemirror/mode/htmlmixed/htmlmixed';
import './styles/docs.scss';

Vue.config.productionTip = false;
Vue.component('DiagramEditor', VueDiagramEditor);

function loadComponents() {
  const loadContext = context => {
    context.keys().forEach(key => {
      const componentName = key.replace(/^\.\/|\.vue$/g, '');
      const component = context(key).default;

      Vue.component(componentName, component);
    });
  };

  loadContext(require.context('./components', false, /\.vue$/));

  if (process.env.NODE_ENV !== 'production') {
    loadContext(require.context('./components/dev', false, /\.vue$/));
  }
}

loadComponents();

document.querySelectorAll('textarea[data-lang]').forEach(el => {
  Codemirror.fromTextArea(el, {
    readOnly: true,
    lineNumbers: typeof el.dataset.lines !== 'undefined' ? Number(el.dataset.lines) : true,
    addModeClass: true,
    viewportMargin: Infinity,
    matchBrackets: true,
    mode: el.dataset.lang,
    theme: 'elegant'
  });
});

document.querySelectorAll('.js-vue').forEach(el => {
  (new Vue({
    render: h => h(el.tagName.toLowerCase())
  })).$mount(el);
});
