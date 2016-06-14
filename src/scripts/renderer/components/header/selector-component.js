import {Observable} from 'rx';

import {div, i} from '@cycle/dom';
import isolate from '@cycle/isolate';

import {click} from '../../utils/cycle-event-helpers';

const toggle = action$ =>
  action$
    .map(ev => Boolean(ev))
    .scan(x => !x)
    .startWith(false);

const intent = DOM => ({
  navToggle$: click(DOM.select('#nav-btn'))
});

const model = ({navToggle$}) =>
  Observable.combineLatest(
    toggle(navToggle$),
    navToggle => ({navToggle})
  );

const view = state$ => state$
  .map(({navToggle}) =>
    div('.grd-row-col-1-6', [
      div('#nav-btn', [
        i(`.fa.fa-navicon${navToggle ? '.fnt--red' : '.fnt--blue'}.p1`)
      ])
    ])
  );

const SelectorComponent = ({DOM}) => {
  const actions = intent(DOM);
  const state$ = model(actions);
  const vtree$ = view(state$);

  return {
    DOM: vtree$
  };
};

export default sources => isolate(SelectorComponent)(sources);
// export default SelectorComponent;
export {intent, model, view, SelectorComponent};
