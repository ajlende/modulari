let Elm = require('./app.js')
let modulari = Elm.App.fullscreen()

let Mopidy = require('mopidy')

let mopidy = new Mopidy({
  webSocketUrl: "ws://localhost:6680/mopidy/ws/",
  callingConvention: "by-position-or-by-name"
})

const toSnake = (str) =>
  str.replace(/([A-Z])/g, ($1) => '_' + $1.toLowerCase())

/////////////////
// Core events //
/////////////////
mopidy.on((msg, data) => {
  const [type, event] = msg.split(':')
  if (type === 'event') {
    console.log(event, data)
    data.event = toSnake(event)
    modulari.ports.mopidyEventSub.send(data)
  }
})


/////////////////////////
// Playback controller //
/////////////////////////

modulari.ports.play.subscribe((tlid) => {
  mopidy.playback.play({tlid: tlid})
})

modulari.ports.next.subscribe(() => {
  mopidy.playback.next({})
})

modulari.ports.previous.subscribe(() => {
  mopidy.playback.previous({})
})

modulari.ports.stop.subscribe(() => {
  mopidy.playback.stop({})
})

modulari.ports.pause.subscribe(() => {
  mopidy.playback.pause({})
})

modulari.ports.resume.subscribe(() => {
  mopidy.playback.resume({})
})

modulari.ports.seek.subscribe((timePosition) => {
  mopidy.playback.seek({time_position: timePosition})
    .then((data) => modulari.ports.seekResult.send(data))
})

modulari.ports.getCurrentTlTrack.subscribe(() => {
  mopidy.playback.getCurrentTlTrack({})
    .then((data) => modulari.ports.currentTlTrack.send(data))
})

modulari.ports.getCurrentTrack.subscribe(() => {
  mopidy.playback.getCurrentTrack({})
    .then((data) => modulari.ports.currentTrack.send(data))
})

modulari.ports.getStreamTitle.subscribe(() => {
  mopidy.playback.getStreamTitle({})
    .then((data) => modulari.ports.streamTitle.send(data))
})

modulari.ports.getTimePosition.subscribe(() => {
  mopidy.playback.getTimePosition({})
    .then((data) => modulari.ports.timePosition.send(data))
})

modulari.ports.getState.subscribe(() => {
  mopidy.playback.getState({})
    .then((data) => modulari.ports.state.send(data))
})

modulari.ports.setState.subscribe((newState) => {
  mopidy.playback.setState({new_state: newState})
})
