import {Observable} from 'rx'

import {div} from '@cycle/dom'
import isolate from '@cycle/isolate'

// TODO: Show currently playing song name or `Modulari`

const NowPlayingComponent = () => {
  return {
    DOM: Observable.just(div(`.now-playing`, `Modulari`)),
  }
}

export default (sources) => isolate(NowPlayingComponent)(sources)
export {NowPlayingComponent}
