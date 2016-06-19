import combineLatestObj from 'rx-combine-latest-obj'

import {button, div, i} from '@cycle/dom'
import isolate from '@cycle/isolate'

import {mouseup, mousedown} from '../../utils/cycle-event-helpers'
import {toggle, hold} from '../../utils/cycle-mvi-helpers'

const intent = (DOM) => {
  const playPauseDown$ = mousedown(DOM.select(`#play-pause i`))
  const playPauseUp$ = mouseup(DOM.select(`#play-pause i`))
  const backwardDown$ = mousedown(DOM.select(`#backward i`))
  const backwardUp$ = mouseup(DOM.select(`#backward i`))
  const forwardDown$ = mousedown(DOM.select(`#forward i`))
  const forwardUp$ = mouseup(DOM.select(`#forward i`))

  return {
    playPause$: toggle(playPauseDown$),
    backwardHeld$: hold(backwardDown$, backwardUp$),
    playPauseHeld$: hold(playPauseDown$, playPauseUp$),
    forwardHeld$: hold(forwardDown$, forwardUp$),
  }
}

const model = ({playPause$, backwardHeld$, playPauseHeld$, forwardHeld$}, playing$) =>
  combineLatestObj({playPause$, backwardHeld$, playPauseHeld$, forwardHeld$, playing$})

const view = (state$) => state$.map(({playing, playPauseHeld, backwardHeld, forwardHeld}) => {
  const backwardColor = backwardHeld ? `.text-color-info` : ``
  const playPauseColor = playPauseHeld ? `.text-color-info` : ``
  const forwardColor = forwardHeld ? `.text-color-info` : ``
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

const ControlsComponent = ({DOM, Playback}) => {
  const playing$ = Playback.event$
    .filter((event) => event.event === `playback_state_changed`)
    .map((event) => {
      if (event.new_state === `playing`)
        return true
      else
        return false
    }).startWith(false)

  const actions = intent(DOM)
  const state$ = model(actions, playing$)
  const vtree$ = view(state$)

  return {
    DOM: vtree$,
  }
}

export default (sources) => isolate(ControlsComponent)(sources)
export {intent, model, view, ControlsComponent}
