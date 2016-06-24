import {run} from '@cycle/core'
import {makeDOMDriver} from '@cycle/dom'

import {Observable} from 'rx'

import {
  makePlaybackDriver,
  makeMixerDriver,
  messageHandler,
  sendCommand as makeSendCommand,
} from './drivers/mopidy/mopidy-driver'

import PlayerComponent from './components/player-component'

const ws = new WebSocket(`ws://localhost:6680/mopidy/ws`)
const ws$ = Observable.create(messageHandler(ws)).share()
const sendCommand = makeSendCommand(ws)

run(PlayerComponent, {
  DOM: makeDOMDriver(`body`),
  Playback: makePlaybackDriver(sendCommand, ws$),
  Mixer: makeMixerDriver(sendCommand, ws$),
})
