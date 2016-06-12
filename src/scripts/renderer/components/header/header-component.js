import {h, span, div} from '@cycle/dom';
import isolate from '@cycle/isolate';
import {Observable} from 'rx';

/**
 * intent - Interpret DOM events as user's intended actions
 *
 * @param  {Object} DOM     DOM Driver source
 * @return {Object} Object containting action$ Observables
 */
const intent = DOM => ({
  navToggle$: DOM.select('#nav-btn').events('click')
});

/**
 * model - manage state
 *
 * @param  {Object} actions Object containting action$ Observables
 * @return {Object} state$ Observable
 */
const model = ({navToggle$}) =>
  Observable.combineLatest(
    navToggle$
      .map(() => true)
      .scan(x => !x)
      .startWith(false),
    navToggle => ({navToggle}));

/**
 * view - visually represent state from the model
 *
 * @param  {Object} state$ Observable
 * @return {Object} vtree$ Observabe as the DOM Driver Sink
 */
const view = state$ => state$.map(({navToggle}) =>
  div('.grd.bg--dark-gray.fnt--light-gray', [
    div('.grd-row', [
      div('#nav-btn.grd-row-col-1-6.p1.txt--center', [
        h('i.fa.fa-navicon' + (navToggle ? '.fnt--white' : ''))
      ]),
      div('.grd-row-col-5-6.p1.txt--center', span('Modulari'))
    ])
  ])
);

/**
 * PlayerComponent - combine model view and intent to create the component
 *
 * @param  {Object} Sources
 * @return {Object} Sinks
 */
const HeaderComponent = ({DOM}) => {
  const actions = intent(DOM);
  const state$ = model(actions);
  const vtree$ = view(state$);

  return {
    DOM: vtree$
  };
};

export default sources => isolate(HeaderComponent)(sources);
export {intent, model, view, HeaderComponent};
