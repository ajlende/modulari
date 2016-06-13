import {Observable} from 'rx';
import isolate from '@cycle/isolate';
import {div, i} from '@cycle/dom';

import {mouseup, mousedown} from '../../utils/cycle-event-helpers';

/**
 * toggle - toggles the value of a stream
 *
 * @param  {Object} action$ Action Observable
 * @return {Object} Observable stream emitting the opposite of last action
 */
const toggle = action$ =>
  action$
    .map(() => true)
    .scan(x => !x)
    .startWith(false);

/**
 * highlighted - returns true if mouseDown event was the last event seen and false otherwise
 *
 * @param  {Object} mouseDown$ MouseDown event stream
 * @param  {Object} mouseUp$   MouseUp event stream
 * @return {Object} Observable stream emitting if the mouse is held down
 */
const highlighted = (mouseDown$, mouseUp$) =>
  Observable
    .merge(mouseDown$.map(() => true), mouseUp$.map(() => false))
    .last()
    .startWith(false);

/**
 * intent - Interpret DOM events as user's intended actions
 *
 * @param  {Object} sources DOM Driver source (and others as needed)
 * @return {Object} Object containting action$ Observables
 */
const intent = DOM => ({
  playPauseDown$: mousedown(DOM.select('#play-pause')),
  playPauseUp$: mouseup(DOM.select('#play-pause')),
  rewindDown$: mousedown(DOM.select('#rewind')),
  rewindUp$: mouseup(DOM.select('#rewind')),
  fastForwardDown$: mousedown(DOM.select('#fast-forward')),
  fastForwardUp$: mouseup(DOM.select('#fast-forward'))
});

/**
 * model - manage state
 *
 * @param  {Object} actions Object containing action$ Observables
 * @return {Object} Observable for the state stream
 */
const model = ({playPauseDown$, playPauseUp$, rewindDown$, rewindUp$, fastForwardDown$,
  fastForwardUp$}) =>
    Observable.combineLatest(playPauseDown$, playPauseUp$, rewindDown$, rewindUp$, fastForwardDown$,
      fastForwardUp$, ({playPauseDown, playPauseUp, rewindDown, rewindUp, fastForwardDown,
        fastForwardUp}) => ({
          playing: toggle(playPauseDown),
          playPauseHighlighted: highlighted(playPauseDown, playPauseUp),
          rewindHighlighted: highlighted(rewindDown, rewindUp),
          fastForwardHighlighted: highlighted(fastForwardDown, fastForwardUp)
        })
    );

/**
 * view - visually represent state from the model
 *
 * @param  {Object} state$ Observable for the state stream
 * @return {Object} Observable of VTree as the DOM Driver Sink
 */
const view = state$ => state$.map(({playing, playPauseHighlighted, rewindHighlighted,
  fastForwardHighlighted}) =>
  div('#controls.grd-row-col-1-6.p1.txt--center', [
    i('.fa.fa-backward' + (rewindHighlighted ? '.fnt--white' : '')),
    i((playing ? '.fa.fa-play' : '.fa.fa-pause') + (playPauseHighlighted ? '.fnt--white' : '')),
    i('.fa.fa-forward' + (fastForwardHighlighted ? '.fnt--white' : ''))
  ])
);

/**
 * PlayerComponent - combine model view and intent to create the component
 *
 * @param  {Object} sources read-effects/incomming-messages
 * @return {Object} sinks write-effects/outgoing-messages
 */
const ControlsComponent = ({DOM}) => {
  const actions = intent(DOM);
  const state$ = model(actions);
  const vtree$ = view(state$);

  return {
    DOM: vtree$
  };
};

export default sources => isolate(ControlsComponent)(sources);
export {toggle, highlighted, intent, model, view, ControlsComponent};
