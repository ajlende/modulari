import {Observable} from 'rx'
import isolate from '@cycle/isolate'
import {div} from '@cycle/dom'

import makeHeaderComponent from './header/header-component'
import makeFormComponent from './sample-form-component'

const view = ({header, form}) => Observable.just(
  div(`.wrapper`, [
    header,
    form,
  ])
)

  const form = makeFormComponent({DOM}).DOM
const PlayerComponent = ({DOM, Playback, Mixer}) => {
  const header = makeHeaderComponent({DOM, Playback, Mixer})

  const vtree$ = view({header: header.DOM, form})

  return {
    DOM: vtree$,
    Playback: header.Playback,
    Mixer: header.Mixer,
  }
}

export default (sources) => isolate(PlayerComponent)(sources)
export {view, PlayerComponent}
