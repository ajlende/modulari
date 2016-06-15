import combineLatestObj from 'rx-combine-latest-obj'

import {div, i} from '@cycle/dom'
import isolate from '@cycle/isolate'

import {click} from '../../utils/cycle-event-helpers'
import {toggle} from '../../utils/cycle-mvi-helpers'

const intent = DOM => {
  const navToggle$ = click(DOM.select(`#nav-btn`))

  return {
    navToggle$: toggle(navToggle$),
  }
}

const model = actions => combineLatestObj(actions)

const view = state$ => state$.map(({navToggle}) => {
  const navColor = navToggle ? `.fnt--red` : `.fnt--blue`
  return div(`.grd-row-col-1-6`, [
    div(`#nav-btn`, [
      i(`.fa.fa-navicon${navColor}.p1`),
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

export default sources => isolate(SelectorComponent)(sources)
export {intent, model, view, SelectorComponent}
