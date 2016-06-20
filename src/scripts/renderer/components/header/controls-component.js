import combineLatestObj from 'rx-combine-latest-obj'

import {button, div, i} from '@cycle/dom'
import isolate from '@cycle/isolate'

import {click} from '../../utils/cycle-event-helpers'
import {bool} from '../../utils/cycle-mvi-helpers'

const isPlaying = (event$) =>
  event$.filter((event) => event.event === `playback_state_changed`)
    .map((event) => {
      if (event.new_state === `playing`)
        return true
      else
        return false
    }).startWith(false)

const intent = (DOM) => ({
  playPause$: click(DOM.select(`#play-pause i`)),
  previous$: click(DOM.select(`#previous i`)),
  next$: click(DOM.select(`#next i`)),
})

const model = ({playPause$, previous$, next$}, playback$) => ({
  playPause$: bool(playPause$),
  previous$: bool(previous$),
  next$: bool(next$),
  playing$: isPlaying(playback$),
})

const view = (data) => combineLatestObj(data).map(({playing}) => {
  const playPauseIcon = playing ? `.fa-pause` : `.fa-play`

  return div(`.controls`, [
    button(`#backward.btn.btn-link.btn-sm`,
      i(`.icon.fa.fa-fw.fa-backward`)),
    button(`#play-pause.btn.btn-link.btn-sm`,
      i(`.icon.fa.fa-fw.${playPauseIcon}`)),
    button(`#forward.btn.btn-link.btn-sm`,
      i(`.icon.fa.fa-fw.fa-forward`)),
  ])
})

const ControlsComponent = ({DOM, Playback}) => {
  const playback$ = Playback.data$
  const actions = intent(DOM)
  const data = model(actions, playback$)
  const vtree$ = view(data)

  const control$ = data.playPause$
    .withLatestFrom(data.playing$, (playPause, playing) => ({playPause, playing}))
    .map(({playPause, playing}) => {
      const command = playing ? Playback.commands.pause() : Playback.commands.play()
      return playPause ? command : null
    })

  return {
    DOM: vtree$,
    Playback: control$,
  }
}

export default (sources) => isolate(ControlsComponent)(sources)
export {intent, model, view, ControlsComponent}
