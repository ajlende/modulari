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
  const selector = makeSelectorComponent({DOM}).DOM
  const controls = makeControlsComponent({DOM, Playback})
  const volume = makeVolumeComponent({DOM}).DOM
  const nowPlaying = makeNowPlayingComponent({DOM}).DOM
  const queue = makeQueueComponent({DOM}).DOM
  const search = makeSearchComponent({DOM}).DOM

  const vtree$ = view({selector, controls: controls.DOM, volume, nowPlaying, queue, search})

  return {
    DOM: vtree$,
    Playback: controls.Playback,
  }
}

export default (sources) => isolate(HeaderComponent)(sources)
export {view, HeaderComponent}
