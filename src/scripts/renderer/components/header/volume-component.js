import combineLatestObj from 'rx-combine-latest-obj'

import {div, i, input} from '@cycle/dom'
import isolate from '@cycle/isolate'

import {click, input as formInput} from '../../utils/cycle-event-helpers'
import {toggle, rangeVal} from '../../utils/cycle-mvi-helpers'

const intent = DOM => {
  const volToggle$ = click(DOM.select(`#vol-btn`))
  const volValue$ = formInput(DOM.select(`input`))

  return {
    volToggle$: toggle(volToggle$),
    volValue$: rangeVal(volValue$, 100),
  }
}

const model = actions => combineLatestObj(actions)

const view = state$ => state$
  .map(({volToggle, volValue}) => {
    let volIcon

    if (volValue > 70)
      volIcon = `.fa-volume-up`
    else if (volValue > 0)
      volIcon = `.fa-volume-down`
    else
      volIcon = `.fa-volume-off`

    let volColor = volToggle ? `.fnt--red` : `.fnt--blue`

    return div(`.grd-row-col-1-6`, [
      div(`#vol-btn`, [
        i(`.fa${volIcon}${volColor}.p1`),
        `${volValue}`,
      ]),
      input({
        type: `range`,
        min: `0`,
        max: `100`,
        value: volValue,
        style: {
          webkitAppearance: `slider-vertical`,
          display: volToggle ? `block` : `none`,
          position: `absolute`,
          width: `2em`,
          height: `8em`,
        },
      }),
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
