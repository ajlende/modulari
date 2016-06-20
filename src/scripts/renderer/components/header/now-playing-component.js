import combineLatestObj from 'rx-combine-latest-obj'

import {div} from '@cycle/dom'
import isolate from '@cycle/isolate'

const intent = (DOM) => ({
  DOM
})

const model = (playback$) => ({
  song$: playback$.pluck(`tl_track`, `track`, `name`).startWith(`Modulari`),
})

const view = (data) => combineLatestObj(data).map(({song}) => div(`.now-playing`, song))

const NowPlayingComponent = ({DOM, Playback}) => {
  const playback$ = Playback.data$
  const actions = intent(DOM)
  const data = model(playback$, actions)
  const vtree$ = view(data)

  return {
    DOM: vtree$,
  }
}

export default (sources) => isolate(NowPlayingComponent)(sources)
export {NowPlayingComponent}
