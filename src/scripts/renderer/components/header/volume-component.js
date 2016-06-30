import combineLatestObj from 'rx-combine-latest-obj'

import {button, div, i, input, span} from '@cycle/dom'
import isolate from '@cycle/isolate'

import {click, input as formInput} from '../../utils/cycle-event-helpers'
import {toggle, rangeVal} from '../../utils/cycle-mvi-helpers'

const intent = (DOM) => {
  const volToggle$ = click(DOM.select(`i`))
  const volValue$ = formInput(DOM.select(`input`))

  return {
    volToggle$: toggle(volToggle$),
    volValue$: rangeVal(volValue$, 100),
  }
}

const model = (actions) => combineLatestObj(actions)

const view = (state$) => state$
  .map(({volToggle, volValue}) => {
    let volIcon
    if (volValue > 70)
      volIcon = `.fa-volume-up`
    else if (volValue > 0)
      volIcon = `.fa-volume-down`
    else
      volIcon = `.fa-volume-off`

    const volColor = volToggle ? `.text-color-info` : ``

    return div(`.volume`, [
      button(`.btn.btn-link.btn-sm`, i(`.icon.fa.fa-fw${volIcon}${volColor}`)),
      span(`${volValue}`),
      input(`.vertical.abs${volToggle ? `.block` : `.hide`}`, {
        type: `range`,
        min: `0`,
        max: `100`,
        value: volValue,
      }),
    ])
  })

const VolumeComponent = ({DOM, Mixer}) => {
  const actions = intent(DOM)
  const state$ = model(actions)
  const vtree$ = view(state$)

  const mixer$ = state$.map(({volValue}) => Mixer.commands.setVolume(volValue))

  return {
    DOM: vtree$,
    Mixer: mixer$,
  }
}

export default (sources) => isolate(VolumeComponent)(sources)
export {intent, model, view, VolumeComponent}
