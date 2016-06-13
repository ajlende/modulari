import {Observable} from 'rx';
import isolate from '@cycle/isolate';
import {div, i} from '@cycle/dom';

import {click} from '../../utils/cycle-event-helpers';

/**
 * toggle - toggles the value of a stream
 *
 * @param  {Object} action$ Action Observable
 * @return {Object} Observable stream emitting the opposite of last action
 */
const toggle = action$ =>
  action$
    .map(ev => Boolean(ev))
    .scan(x => !x)
    .startWith(false);

/**
 * intent - Interpret DOM events as user's intended actions
 *
 * @param  {Object} DOM     DOM Driver source
 * @return {Object} Object containting action$ Observables
 */
const intent = DOM => ({
  navToggle$: click(DOM.select('#nav-btn'))
});

/**
 * model - manage state
 *
 * @param  {Object} actions Object containting action$ Observables
 * @return {Object} state$ Observable
 */
const model = ({navToggle$}) =>
  Observable.combineLatest(
    toggle(navToggle$),
    navToggle => ({navToggle})
  );

/**
 * view - visually represent state from the model
 *
 * @param  {Object} state$ Observable for the state stream
 * @return {Object} Observable of VTree as the DOM Driver Sink
 */
const view = state$ => state$
  .map(({navToggle}) =>
    div('#nav-btn.grd-row-col-6-6.p1', [
      i(`.fa.fa-navicon${navToggle ? '.fnt--red' : '.fnt--blue'}.txt--center`)
    ])
  );

/**
 * SelectorComponent - combine model view and intent to create the component
 *
 * @param  {Object} sources read-effects/incomming-messages
 * @return {Object} sinks write-effects/outgoing-messages
 */
const SelectorComponent = ({DOM}) => {
  // Model-View-Intent
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
