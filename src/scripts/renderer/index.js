import {run} from '@cycle/core'
import {makeDOMDriver} from '@cycle/dom'

import PlayerComponent from './components/player-component'

run(PlayerComponent, {
  DOM: makeDOMDriver(`#app`),
})
