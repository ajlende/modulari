import {run} from '@cycle/core'
import {makeDOMDriver} from '@cycle/dom'

import {makePlaybackDriver} from './drivers/mopidy/mopidy-driver'

import PlayerComponent from './components/player-component'

const ws = new WebSocket(`ws://localhost:6680/mopidy/ws`)

run(PlayerComponent, {
  DOM: makeDOMDriver(`body`),
  Playback: makePlaybackDriver(ws),
})
