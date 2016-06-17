import combineLatestObj from 'rx-combine-latest-obj'

import {button, div, i} from '@cycle/dom'
import isolate from '@cycle/isolate'

import {mouseup, mousedown} from '../../utils/cycle-event-helpers'
import {toggle, hold} from '../../utils/cycle-mvi-helpers'

const intent = DOM => {
  const playPauseDown$ = mousedown(DOM.select(`#play-pause i`))
  const playPauseUp$ = mouseup(DOM.select(`#play-pause i`))
  const backwardDown$ = mousedown(DOM.select(`#backward i`))
  const backwardUp$ = mouseup(DOM.select(`#backward i`))
  const forwardDown$ = mousedown(DOM.select(`#forward i`))
  const forwardUp$ = mouseup(DOM.select(`#forward i`))

  return {
    playing$: toggle(playPauseDown$),
    backwardHighlighted$: hold(backwardDown$, backwardUp$),
    playPauseHighlighted$: hold(playPauseDown$, playPauseUp$),
    forwardHighlighted$: hold(forwardDown$, forwardUp$),
  }
}

const model = actions => combineLatestObj(actions)

const view = state$ => state$.map(({playing, playPauseHighlighted, backwardHighlighted,
  forwardHighlighted}) => {
  const backwardColor = backwardHighlighted ? `.text-color-danger` : `.text-color-info`
  const playPauseColor = playPauseHighlighted ? `.text-color-danger` : `.text-color-info`
  const forwardColor = forwardHighlighted ? `.text-color-danger` : `.text-color-info`
  const playPauseIcon = playing ? `.fa-pause` : `.fa-play`

  return div(`.controls`, [
    button(`#backward.btn.btn-link.btn-sm`,
      i(`.icon.fa.fa-fw.fa-backward${backwardColor}`)),
    button(`#play-pause.btn.btn-link.btn-sm`,
      i(`.icon.fa.fa-fw.${playPauseIcon}${playPauseColor}`)),
    button(`#forward.btn.btn-link.btn-sm`,
      i(`.icon.fa.fa-fw.fa-forward${forwardColor}`)),
  ])
})

const ControlsComponent = ({DOM}) => {
  const actions = intent(DOM)
  const state$ = model(actions)
  const vtree$ = view(state$)

  return {
    DOM: vtree$,
  }
}

export default sources => isolate(ControlsComponent)(sources)
export {intent, model, view, ControlsComponent}
