import {Observable} from 'rx'

import {header, section} from '@cycle/dom'
import isolate from '@cycle/isolate'

import makeControlsComponent from './controls-component'
import makeSelectorComponent from './selector-component'
import makeVolumeComponent from './volume-component'
import makeNowPlayingComponent from './now-playing-component'
import makeQueueComponent from './queue-component'
import makeSearchComponent from './search-component'

const view = ({selector, controls, volume, nowPlaying, queue, search}) => Observable.just(
  header(`.navbar`, [
    section(`.navbar-section`, [
      selector,
      controls,
      volume,
    ]),
    section(`.navbar-section`, [
      nowPlaying,
    ]),
    section(`.navbar-section`, [
      queue,
      search,
    ]),
  ])
)

const HeaderComponent = ({DOM, Playback}) => {
  const {DOM: selector} = makeSelectorComponent({DOM})
  const {DOM: controls, Playback: playback$} = makeControlsComponent({DOM, Playback})
  const {DOM: volume} = makeVolumeComponent({DOM})
  const {DOM: nowPlaying} = makeNowPlayingComponent({DOM, Playback})
  const {DOM: queue} = makeQueueComponent({DOM})
  const {DOM: search} = makeSearchComponent({DOM})

  const vtree$ = view({selector, controls, volume, nowPlaying, queue, search})

  return {
    DOM: vtree$,
    Playback: playback$,
  }
}

export default (sources) => isolate(HeaderComponent)(sources)
export {view, HeaderComponent}
