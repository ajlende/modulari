/**
 * PlaybackController - Handles commands and events related to playback in Mopidy
 *
 * Controls the following in Mopidy:
 * - play(tl_track:Track, tlid:int)-> {null}
 * - next() ------------------------> {null}
 * - previous() --------------------> {null}
 * - stop() ------------------------> {null}
 * - pause() -----------------------> {null}
 * - resume() ----------------------> {null}
 * - seek(time_position:int) -------> {boolean} true if successful, else false
 * - get_current_tl_track() --------> {TlTrack} current tlTrack
 * - get_current_track() -----------> {Track}   current track
 * - get_stream_title() ------------> {string}  stream title
 * - get_time_position() -----------> {number}  position in milliseconds
 * - get_state() -------------------> {string}  playing|paused|stopped
 * - set_state(new_state:string) ---> {null}
 *
 * Handles the following events from Mopdidy:
 * - playback_state_changed --------> {old_state:string, new_state:string}
 * - seeked ------------------------> {time_position:number}
 * - stream_title_changed ----------> {title:string}
 * - track_playback_ended ----------> {tl_track:TlTrack, time_position:number}
 * - track_playback_paused ---------> {tl_track:TlTrack, time_position:number}
 * - track_playback_resumed --------> {tl_track:TlTrack, time_position:number}
 * - track_playback_started --------> {tl_track:TlTrack}
 *
 * NOTE: `int` refers to a 32-bit Integer that can be acquired using `number|0`.
 *       Passing in a regular number WILL NOT WORK!!!
 *
 * Mopify API Reference:
 * https://docs.mopidy.com/en/latest/api/core/#playback-controller
 * https://docs.mopidy.com/en/latest/api/core/#core-events
 */

import {Observable} from 'rx'
import {zipOneWayWithDefault} from '../../utils/rx-zip-one-way'

import {createRequest} from './mopidy-driver'

/**
 * commands - Create commands that can be sent to Mopidy to control it
 *
 * See the Mopidy API for params
 */
const commands = {
  play: () => createRequest(`play`),
  next: () => createRequest(`next`),
  previous: () => createRequest(`previous`),
  stop: () => createRequest(`stop`),
  pause: () => createRequest(`pause`),
  resume: () => createRequest(`resume`),
  seek: (position) => createRequest(`seek`, {time_position: position}),
  setState: (state) => createRequest(`set_state`, {new_state: state}),
  getState: () => createRequest(`get_state`),
  getCurrentTlTrack: () => createRequest(`get_current_tl_track`),
  getCurrentTlid: () => createRequest(`get_current_tlid`),
  getCurrentTrack: () => createRequest(`get_current_track`),
  getStreamTitle: () => createRequest(`get_stream_title`),
  getTimePosition: () => createRequest(`get_time_position`),
}

/**
 * makePlaybackDriver - Creates a Cycle.js Playback Driver for Mopidy
 *
 * @param {Object} ws - the Mopidy WebSocket
 * @return The Playback Driver
 */
const makePlaybackDriver = (sendCommand, ws$) => (command$) => {
  // Time position
  // HACK: starting the timer after a second allows time for the websocket to connect
  // HACK: x2 sending a getTimePosition command every second to keep track of song position
  const timer$ = Observable.timer(1000, 1000).map(() => commands.getTimePosition())

  // Send the commands including one every second for the timer
  Observable.merge(command$, timer$).subscribe(sendCommand)

  // Only responses of commands packaged as an Object with response and command keys
  const response$ = zipOneWayWithDefault(
    ws$,
    command$,
    false, // false as default command for filtering below
    (response, command) => ({response, command})
  ).filter((e) => e.command) // e.command === false -> not associated with a command

  // Only playback events not associated with a command
  const event$ = ws$.filter((res) =>
    res.hasOwnProperty(`event`) && (
      res.event.indexOf(`playback`) !== -1 ||
      res.event.indexOf(`seeked`) !== -1 ||
      res.event.indexOf(`stream`) !== -1
    ))

  // All events and responses of commands (easily filterable by (e) => e.hasOwnProperty(`command`))
  // Does not include the timer responses
  const data$ = Observable.merge(event$, response$)

  // Debug logging
  data$.subscribe((e) => console.log(`Playback:`, e))

  // HACK: x3 get the position with lots of filtering to make sure it's the correct response
  const position$ = zipOneWayWithDefault(ws$, timer$, false,
    (response, command) => ({response, command}))
    .filter((e) =>
      e.command &&
      e.command.hasOwnProperty(`method`) &&
      e.command.method.indexOf(`get_time_position`) !== -1 &&
      e.response &&
      e.response.hasOwnProperty(`result`) &&
      Number.isInteger(e.response.result))
    .map((e) => e.response.result)

  return {
    data$,
    position$,
    commands,
  }
}

export default makePlaybackDriver
