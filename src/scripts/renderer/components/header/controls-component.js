import {Observable} from 'rx'
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

// TODO: combineLatestObj might be causing problems with the view when playPause$, next$, and
// previous$ don't have an initial value. Try removing the startWith values and ternaries and
// combineLatestObj to see if it reders properly then.
const view = (data) => combineLatestObj(data).map(({playing}) => {
  const playPauseIcon = playing ? `.fa-pause` : `.fa-play`

  return div(`.controls`, [
    button(`#previous.btn.btn-link.btn-sm`,
      i(`.icon.fa.fa-fw.fa-backward`)),
    button(`#play-pause.btn.btn-link.btn-sm`,
      i(`.icon.fa.fa-fw.${playPauseIcon}`)),
    button(`#next.btn.btn-link.btn-sm`,
      i(`.icon.fa.fa-fw.fa-forward`)),
  ])
})

const ControlsComponent = ({DOM, Playback}) => {
  const playback$ = Playback.data$
  const actions = intent(DOM)
  const data = model(actions, playback$)
  const vtree$ = view(data)

  // For now the ternary check in each is needed because Cycle.js requires initial values for
  // everything, so default values of false are being set in the click() function in
  // cycle-mvi-helpers. The ternary checks if it's the first command or not, basically.
  const playPause$ = data.playPause$
    .withLatestFrom(data.playing$, (playPause, playing) => ({playPause, playing}))
    .map(({playPause, playing}) => {
      const command = playing ? Playback.commands.pause() : Playback.commands.play()
      return playPause ? command : null
    })

  const next$ = data.next$
    .map((next) => { return next ? Playback.commands.next() : null })

  const previous$ = data.previous$
    .map((previous) => { return previous ? Playback.commands.previous() : null })

  return {
    DOM: vtree$,
    Playback: Observable.merge(playPause$, next$, previous$),
  }
}

export default (sources) => isolate(ControlsComponent)(sources)
export {intent, model, view, ControlsComponent}
