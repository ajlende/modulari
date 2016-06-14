import {Observable} from 'rx';

import {div, input, p} from '@cycle/dom';
import isolate from '@cycle/isolate';

import {change} from '../../utils/cycle-event-helpers';

const check = checkbox$ =>
  checkbox$
    .map(ev => ev.target.checked)
    .startWith(false);

const intent = DOM => ({
  checkbox$: change(DOM.select('input'))
});

const model = ({checkbox$}) =>
  Observable.combineLatest(
    check(checkbox$),
    checkbox => ({checkbox})
  );

const view = state$ => state$
  .map(({checkbox}) =>
    div([
      input({type: 'checkbox'}),
      'Toggle me',
      p(`${checkbox ? 'ON' : 'off'}`)
    ])
  );

const main = ({DOM}) => {
  const actions = intent(DOM);
  const state$ = model(actions);
  const vtree$ = view(state$);

  return {
    DOM: vtree$
  };
};

export default sources => isolate(main)(sources);
export {intent, model, view, main};
