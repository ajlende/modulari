import {Observable} from 'rx'

import {div} from '@cycle/dom'
import isolate from '@cycle/isolate'

import makeControlsComponent from './controls-component'
import makeSelectorComponent from './selector-component'
import makeVolumeComponent from './volume-component'

const view = (selector, controls, volume) => Observable.just(
  div(`.grd.bg--dark-gray.fnt--light-gray`, [
    div(`.grd-row`, [
      selector,
      controls,
      volume,
    ]),
  ])
)

const HeaderComponent = ({DOM}) => {
  const selector = makeSelectorComponent({DOM}).DOM
  const controls = makeControlsComponent({DOM}).DOM
  const volume = makeVolumeComponent({DOM}).DOM

  const vtree$ = view(selector, controls, volume)

  return {
    DOM: vtree$,
  }
}

export default sources => isolate(HeaderComponent)(sources)
export {view, HeaderComponent}
