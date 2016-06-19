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

const PlayerComponent = ({DOM, Playback}) => {
  const header = makeHeaderComponent({DOM, Playback}).DOM
  const form = makeFormComponent({DOM}).DOM

  const vtree$ = view({header, form})

  return {
    DOM: vtree$,
  }
}

export default (sources) => isolate(PlayerComponent)(sources)
export {view, PlayerComponent}
