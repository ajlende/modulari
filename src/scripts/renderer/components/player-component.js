import {Observable} from 'rx'
import isolate from '@cycle/isolate'
import {div} from '@cycle/dom'

import makeHeaderComponent from './header/header-component'
import makeContentComponent from './content/content-component'

const view = ({header, content}) => Observable.just(
  div(`.wrapper`, [
    header,
    content,
  ])
)

const PlayerComponent = ({DOM, Playback, Mixer, Tracklist}) => {
  const header = makeHeaderComponent({DOM, Playback, Mixer})
  const content = makeContentComponent({Tracklist, Playback})

  const vtree$ = view({
    header: header.DOM,
    content: content.DOM,
  })

  return {
    DOM: vtree$,
    Playback: header.Playback,
    Mixer: header.Mixer,
    Tracklist: content.Tracklist,
  }
}

export default (sources) => isolate(PlayerComponent)(sources)
export {view, PlayerComponent}
