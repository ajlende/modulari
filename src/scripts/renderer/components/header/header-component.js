import {Observable} from 'rx'

import {header, section} from '@cycle/dom'
import isolate from '@cycle/isolate'

import makeControlsComponent from './controls-component'
import makeSelectorComponent from './selector-component'
import makeVolumeComponent from './volume-component'
import makeNowPlayingComponent from './now-playing-component'
import makeQueueComponent from './queue-component'

const view = ({selector, controls, volume, nowPlaying, queue}) => Observable.just(
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
    ]),
  ])
)

const HeaderComponent = ({DOM}) => {
  const selector = makeSelectorComponent({DOM}).DOM
  const controls = makeControlsComponent({DOM}).DOM
  const volume = makeVolumeComponent({DOM}).DOM
  const nowPlaying = makeNowPlayingComponent({DOM}).DOM
  const queue = makeQueueComponent({DOM}).DOM

  const vtree$ = view({selector, controls, volume, nowPlaying, queue})

  return {
    DOM: vtree$,
  }
}

export default (sources) => isolate(HeaderComponent)(sources)
export {view, HeaderComponent}
