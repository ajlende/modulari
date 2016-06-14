import {Observable} from 'rx';
import isolate from '@cycle/isolate';
import {div, i} from '@cycle/dom';

import {mouseup, mousedown} from '../../utils/cycle-event-helpers';

const toggle = action$ =>
  action$
    .map(ev => Boolean(ev))
    .scan(x => !x)
    .startWith(false);

const highlighted = (mouseDown$, mouseUp$) =>
  Observable
    .merge(mouseDown$.map(() => true), mouseUp$.map(() => false))
    .startWith(false);

const intent = DOM => ({
  playPauseDown$: mousedown(DOM.select('#play-pause')),
  playPauseUp$: mouseup(DOM.select('#play-pause')),
  backwardDown$: mousedown(DOM.select('#backward')),
  backwardUp$: mouseup(DOM.select('#backward')),
  forwardDown$: mousedown(DOM.select('#forward')),
  forwardUp$: mouseup(DOM.select('#forward'))
});

const model = ({playPauseDown$, playPauseUp$, backwardDown$, backwardUp$, forwardDown$, forwardUp$}) =>
    Observable.combineLatest(
      toggle(playPauseDown$),
      highlighted(playPauseDown$, playPauseUp$),
      highlighted(backwardDown$, backwardUp$),
      highlighted(forwardDown$, forwardUp$),
      (playing, playPauseHighlighted, backwardHighlighted, forwardHighlighted) =>
      ({playing, playPauseHighlighted, backwardHighlighted, forwardHighlighted})
    );

const view = state$ => state$.map(({playing, playPauseHighlighted, backwardHighlighted, forwardHighlighted}) =>
    div('.grd-row-col-5-6', [
      i(`#backward.fa.fa-backward${backwardHighlighted ? '.fnt--red' : '.fnt--blue'}.p1`),
      i(`#play-pause.fa${playing ? '.fa-play' : '.fa-pause'}${playPauseHighlighted ? '.fnt--red' : '.fnt--blue'}.p1`),
      i(`#forward.fa.fa-forward${forwardHighlighted ? '.fnt--red' : '.fnt--blue'}.p1`)
    ])
);

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
