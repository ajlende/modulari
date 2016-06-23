/**
 * MixerDriver - Handles commands and events related to the mixer in Mopidy
 *
 * Controls the following in Mopidy:
 * - get_mute   () -> Boolean: True if muted, False unmuted, Null if unknown
 * - get_volume () -> Integer[0..100] or Null if unknown
 * - set_mute   (mute:boolean) -> Boolean: True if successful, otherwise False
 * - set_volume (volume:integer[0..100]) -> Boolean: True if successful, otherwise False
 *
 * Handles the following events from Mopdidy:
 * - mute_changed   (mute)
 * - volume_changed (volume)
 *
 * Mopify API Reference:
 * http://mopidy.readthedocs.io/en/latest/api/core/#mixer-controller
 * https://docs.mopidy.com/en/latest/api/core/#core-events
 */

import {Observable} from 'rx'
import {zipOneWayWithDefault} from '../../utils/rx-zip-one-way'

import {createRequest, sendCommand, messageHandler} from './mopidy-driver'

/**
 * commands - Create commands that can be sent to Mopidy to control it
 *
 * See the Mopidy API for params
 */
const commands = {
  getMute: () => createRequest(`get_mute`),
  getVolume: () => createRequest(`get_volume`),
  setMute: (mute) => createRequest(`set_mute`, {mute: mute|0}),
  setVolume: (volume) => createRequest(`set_volume`, {volume: volume|0}),
}

/**
 * makeMixerDriver - Creates a Cycle.js Mixer Driver for Mopidy
 *
 * @param {Object} ws - the Mopidy WebSocket
 * @return The Mixer Driver
 */
const makeMixerDriver = (ws) => (command$) => {
  command$.subscribe(sendCommand(ws))

  const ws$ = Observable.create(messageHandler(ws)).share()

  const response$ = zipOneWayWithDefault(
    ws$,
    command$,
    false,
    (response, command) => ({response, command})
  ).filter((e) => e.command)

  const event$ = ws$.filter((res) =>
    res.hasOwnProperty(`event`) && (
      res.event.indexOf(`mute`) !== -1 ||
      res.event.indexOf(`volume`) !== -1
    ))

  const data$ = Observable.merge(event$, response$)

  data$.subscribe((e) => console.log(`Mixer:`, e))

  return {
    data$,
    commands,
  }
}

export default makeMixerDriver
