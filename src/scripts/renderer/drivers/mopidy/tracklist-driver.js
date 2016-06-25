/**
 * PlaybackController - Handles commands and events related to playback in Mopidy
 *
 * Controls the following in Mopidy:
 * - Manipulating
 *   - add(uris:string[], at_position:int) -------> {TlTrack[]} List of tlTracks (added?)
 *   - remove(criteria:Object) -------------------> {TlTrack[]} List of tlTracks removed
 *   - clear() -----------------------------------> {null}
 *   - move(start:int, end:int, to_position:int) -> {null}
 *   - shuffle(start:int, end:int) ---------------> {null}
 * - Current State
 *   - get_tl_tracks() ---------------------------> {TlTrack[]} Tracklist as TlTracks
 *   - index(tl_track:TlTrack, tlid:int) ---------> {number}    The position of the given track
 *   - get_version() -----------------------------> {number}    Current count of tracklist changes
 *   - get_length() ------------------------------> {number}    Number of items in the tracklist
 *   - get_tracks() ------------------------------> {Track[]}   Tracklist as Tracks
 *   - slice(start:int, end:int) -----------------> {TlTrack[]} Section of tracklist
 *   - filter(criteria:Object) -------------------> {TlTrack[]} Filtered tracklist
 * - Future State
 *   - get_eot_tlid() ----------------------------> {number}  TLID of next track in list
 *   - get_next_tlid() ---------------------------> {number}  TLID after calling next()
 *   - get_previous_tlid() -----------------------> {number}  TLID after calling previous()
 *   - eot_track(tl_track:TlTrack) ---------------> {TlTrack} TlTrack in list after given
 *   - next_track(tl_track:TlTrack) --------------> {TlTrack} TlTrack after calling next() on given
 *   - previous_track(tl_track:TlTrack) ----------> {TlTrack} TlTrack after calling previous() ""
 * - Options
 *   - get_consume() -----------------------------> {boolean} Consume mode
 *   - set_consume(value:boolean) ----------------> {null?}
 *   - get_random() ------------------------------> {boolean} Random mode
 *   - set_random(value:boolean) -----------------> {null?}
 *   - get_repeat() ------------------------------> {boolean} Repeat mode
 *   - set_repeat(value:boolean) -----------------> {null?}
 *   - get_single() ------------------------------> {boolean} Single mode
 *   - set_single(value:boolean) -----------------> {null?}
 *
 * Handles the following events from Mopdidy:
 * - options_changed -----------------------------> {null}
 * - tracklist_changed ---------------------------> {null}
 *
 * NOTE: To repeat a single track, set both repeat and single
 *
 * NOTE: `int` refers to a 32-bit Integer that can be acquired using `number|0`.
 *       Passing in a regular number WILL NOT WORK!!!
 *
 * Mopify API Reference:
 * https://docs.mopidy.com/en/latest/api/core/#tracklist-controller
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
  add: (uris, at_position) => createRequest(`add`, {uris, at_position}),
  remove: (criteria) => createRequest(`remove`, {criteria}),
  clear: () => createRequest(`clear`),
  move: (start, end, to_position) => createRequest(`move`, {start, end, to_position}),
  shuffle: (start, end) => createRequest(`shuffle`, {start, end}),
  getTlTracks: () => createRequest(`get_tl_tracks`),
  index: (tl_track, tlid) => createRequest(`index`, {tl_track, tlid}),
  getVersion: () => createRequest(`get_version`),
  getLength: () => createRequest(`get_length`),
  getTracks: () => createRequest(`get_tracks`),
  slice: (start, end) => createRequest(`slice`, {start, end}),
  filter: (criteria) => createRequest(`filter`, {criteria}),
  getEotTlid: () => createRequest(`get_eot_tlid`),
  getNextTlid: () => createRequest(`get_next_tlid`),
  getPreviousTlid: () => createRequest(`get_previous_tlid`),
  eotTrack: (tl_track) => createRequest(`eot_track`, {tl_track}),
  nextTrack: (tl_track) => createRequest(`next_track`, {tl_track}),
  previousTrack: (tl_track) => createRequest(`previous_track`, {tl_track}),
  getConsume: () => createRequest(`get_consume`),
  setConsume: (value) => createRequest(`set_consume`, {value}),
  getRandom: () => createRequest(`get_random`),
  setRandom: (value) => createRequest(`set_random`, {value}),
  getRepeat: () => createRequest(`get_repeat`),
  setRepeat: (value) => createRequest(`set_repeat`, {value}),
  getSingle: () => createRequest(`get_single`),
  setSingle: (value) => createRequest(`set_single`, {value}),
}

/**
 * makeTracklistDriver - Creates a Cycle.js Tracklist Driver for Mopidy
 *
 * @param {Object} ws - the Mopidy WebSocket
 * @return The Tracklist Driver
 */
const makeTracklistDriver = (sendCommand, ws$) => (command$) => {
  const response$ = zipOneWayWithDefault(
    ws$,
    command$,
    false,
    (response, command) => ({response, command})
  ).filter((e) => e.command)

  const event$ = ws$.filter((res) =>
    res.hasOwnProperty(`event`) && (
      res.event.indexOf(`tracklist`) !== -1 ||
      res.event.indexOf(`options`) !== -1
    ))

  const data$ = Observable.merge(event$, response$)

  data$.subscribe((e) => console.log(`Tracklist:`, e))

  return {
    data$,
    commands,
  }
}

export default makeTracklistDriver
