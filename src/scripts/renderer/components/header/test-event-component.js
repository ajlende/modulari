import {div, input, p} from '@cycle/dom';
import isolate from '@cycle/isolate';
import {Observable} from 'rx';
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

function main({DOM}) {
  const sinks = {
    DOM: view(model(intent(DOM)))
  };
  return sinks;
}

export default sources => isolate(main)(sources);
export {intent, model, view, main};
