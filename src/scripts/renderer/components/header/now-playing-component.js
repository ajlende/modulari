import combineLatestObj from 'rx-combine-latest-obj'

import {div, strong} from '@cycle/dom'
import isolate from '@cycle/isolate'

import {ms as formatTime} from '../../utils/format-time'

const model = (track$, position$) => ({
  name$: track$.pluck(`name`).startWith(false),
  artist$: track$.pluck(`artists`, 0, `name`).startWith(false),
  album$: track$.pluck(`album`, `name`).startWith(false),
  length$: track$.pluck(`length`).startWith(0),
  position$: position$.startWith(0),
})

const view = (data) => combineLatestObj(data).map(({name, artist, album, length, position}) =>
  div(`.now-playing`, [
    div(`.song-info`, !name ? `Modulari` : [
      strong(name),
      ` by `,
      strong(artist),
      ` on `,
      strong(album),
    ]),
    div(`.song-length`, length <= 0 ? `` : [
      `${formatTime(position)}/${formatTime(length)}`,
    ]),
  ]))

// TODO: remove eslint-disable-line when intent is filled out and we're using the DOM
const NowPlayingComponent = ({DOM, Playback}) => { // eslint-disable-line no-unused-vars
  const playback$ = Playback.data$
  const position$ = Playback.position$
  const track$ = playback$
    .filter((e) => e.hasOwnProperty(`tl_track`))
    .pluck(`tl_track`, `track`)
  const data = model(track$, position$)
  const vtree$ = view(data)

  return {
    DOM: vtree$,
  }
}

export default (sources) => isolate(NowPlayingComponent)(sources)
export {NowPlayingComponent}
