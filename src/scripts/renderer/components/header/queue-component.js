import combineLatestObj from 'rx-combine-latest-obj'

import {button, div, i} from '@cycle/dom'
import isolate from '@cycle/isolate'

import {click} from '../../utils/cycle-event-helpers'
import {toggle} from '../../utils/cycle-mvi-helpers'

const intent = (DOM) => {
  const queueToggle$ = click(DOM.select(`i`))

  return {
    queueToggle$: toggle(queueToggle$),
  }
}

const model = (actions) => combineLatestObj(actions)

const view = (state$) => state$.map(({queueToggle}) => {
  const navColor = queueToggle ? `.text-color-info` : ``
  return div(`.queue`, [
    button(`.btn.btn-link.btn-sm`, [
      i(`.icon.fa.fa-list${navColor}`),
    ]),
  ])
})

const SelectorComponent = ({DOM}) => {
  const actions = intent(DOM)
  const state$ = model(actions)
  const vtree$ = view(state$)

  return {
    DOM: vtree$,
  }
}

export default (sources) => isolate(SelectorComponent)(sources)
export {intent, model, view, SelectorComponent}
