import combineLatestObj from 'rx-combine-latest-obj'
import isolate from '@cycle/isolate'
import {table, thead, tbody, tr, th, td, span} from '@cycle/dom'
import {ms as formatTime} from '../../utils/format-time'

const row = (tlTrack, playing) => {
  const track = tlTrack.track
  const album = track.album.name
  const artist = track.artists.map((a) => a.name).join(`, `)
  const duration = formatTime(track.length)
  const name = track.name
  const uri = track.uri

  console.log(uri, playing)

  return tr([
    td(playing === uri ? span(`.fa.fa-volume-up`) : ``),
    td(name),
    td(duration),
    td(artist),
    td(album),
  ])
}

const currentSong = (Playback) =>
  Playback.data$
    .filter((event) => {
      return event.event === `track_playback_resumed` ||
             event.event === `track_playback_started` ||
             event.event === `track_playback_stopped`
    })
    .map((event) => event.tl_track.track.uri)
    .startWith(``)

const currentTracklist = (Tracklist) =>
  Tracklist.data$
    .filter((event) => event.command === `get_tl_tracks`)
    .map((event) => event.response)
    .startWith([])

const model = (Tracklist, Playback) => {
  return {
    tlTracks$: currentTracklist(Tracklist),
    playing$: currentSong(Playback),
  }
}

const view = (data) => combineLatestObj(data).map(({tlTracks, playing}) =>
  table(`.table.table-striped.table-hover`, [
    thead([
      tr([
        th(``),
        th(`Track`),
        th(`Duration`),
        th(`Artist`),
        th(`Album`),
      ]),
    ]),
    tbody(
      tlTracks.map((tlTrack) => row(tlTrack, playing))
    ),
  ])
)

const ContentComponent = ({Tracklist, Playback}) => {
  const data = model(Tracklist, Playback)
  const vtree$ = view(data)

  const commands$ = Playback.data$
    .filter((event) => event.event === `playback_state_changed`)
    .map(() => Tracklist.commands.getTlTracks())

  return {
    DOM: vtree$,
    Tracklist: commands$,
  }
}

export default (sources) => isolate(ContentComponent)(sources)
export {view, ContentComponent}
