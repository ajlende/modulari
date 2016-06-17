import combineLatestObj from 'rx-combine-latest-obj'

import {div, i, input} from '@cycle/dom'
import isolate from '@cycle/isolate'

import {click} from '../../utils/cycle-event-helpers'
import {toggle} from '../../utils/cycle-mvi-helpers'

const intent = (DOM) => {
  const searchToggle$ = click(DOM.select(`i`))

  return {
    searchToggle$: toggle(searchToggle$),
  }
}

const model = (actions) => combineLatestObj(actions)

const view = (state$) => state$.map(({searchToggle}) => {
  return div(`.search`, [
    input(`.form-input.input-inline`, {placeholder: `${searchToggle ? `` : `search`}`}, [
      i(`.icon.fa.fa-search`),
    ]),
  ])
})

const SearchComponent = ({DOM}) => {
  const actions = intent(DOM)
  const state$ = model(actions)
  const vtree$ = view(state$)

  return {
    DOM: vtree$,
  }
}

export default (sources) => isolate(SearchComponent)(sources)
export {intent, model, view, SearchComponent}
