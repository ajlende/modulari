import combineLatestObj from 'rx-combine-latest-obj';

import {div, i} from '@cycle/dom';
import isolate from '@cycle/isolate';

import {mouseup, mousedown} from '../../utils/cycle-event-helpers';
import {toggle, hold} from '../../utils/cycle-mvi-helpers';

const intent = DOM => {
  const playPauseDown$ = mousedown(DOM.select('#play-pause'));
  const playPauseUp$ = mouseup(DOM.select('#play-pause'));
  const backwardDown$ = mousedown(DOM.select('#backward'));
  const backwardUp$ = mouseup(DOM.select('#backward'));
  const forwardDown$ = mousedown(DOM.select('#forward'));
  const forwardUp$ = mouseup(DOM.select('#forward'));

  return {
    playing$: toggle(playPauseDown$),
    backwardHighlighted$: hold(backwardDown$, backwardUp$),
    playPauseHighlighted$: hold(playPauseDown$, playPauseUp$),
    forwardHighlighted$: hold(forwardDown$, forwardUp$)
  };
};

const model = actions => combineLatestObj(actions);

const view = state$ => state$.map(({playing, playPauseHighlighted, backwardHighlighted, forwardHighlighted}) =>
    div('.grd-row-col-2-6', [
      i(`#backward.fa.fa-backward${backwardHighlighted ? '.fnt--red' : '.fnt--blue'}.p1`),
      i(`#play-pause.fa${playing ? '.fa-pause' : '.fa-play'}${playPauseHighlighted ? '.fnt--red' : '.fnt--blue'}.p1`),
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
export {intent, model, view, ControlsComponent};
