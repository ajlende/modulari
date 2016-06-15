import {ReplaySubject, Observable} from 'rx'
import {h} from '@cycle/dom'

const toPlayerState = player => ({
  duration: player.duration,
  volume: player.volume * 100,
  position: player.currentTime,
  playbackRate: player.playbackRate,
  source: player.currentSrc,
  width: player.videoWidth,
  height: player.videoHeight,
  isFinished: player.ended,
  isMuted: player.muted,
  isPlaying: !player.paused,
  isSeeking: player.seeking,
  isLooped: player.loop,
})

const MEDIA_EVENTS = Observable.from([`play`,
  `pause`,
  `volumechange`,
  `durationchange`,
  `loadstart`,
  `emptied`,
  `ratechange`,
  `waiting`,
  `timeupdate`])

const makePlayerEvent$ = player =>
  MEDIA_EVENTS
    .flatMap(event => Observable.fromEvent(player, event))
    .pluck(`target`)

const makeCommand$ = controls =>
  Observable.merge(...Object.keys(controls)
    .map(name => controls[name].map(value => ({name, value}))))

const driverDefaults = () => ({
  isPlaying: false,
  position: 0,
  duration: 0,
  volume: 100,
})

const media = {
  play() { this.play() },
  pause() { this.pause() },
  load() { this.load() },
  volume(v) { this.volume = v * 0.01 },
  position(p) { this.currentTime = p },
  replay() {
    this.currentTime = 0
    this.play()
  },
}

class Hook {
  constructor(node$) {
    this.node$ = node$
  }
  hook(node, tagname) {
    node._fqtn = tagname
    this.node$.onNext(node)
  }
}

const makeVideoDriver = () =>
  source$ => {
    const node$ = new ReplaySubject()

    source$.forEach(([node, {name, value}]) => {
      if (name in media)
        // stage-0 bind/call operator same as
        // media[name].call(node, value)
        node::media[name](value)
    })

    const createMediaHelper = mediaType => (tagName, properties, children) => {
      const fullyQualifiedTagName = mediaType.concat(tagName.replace(` `, ``))
      const filteredNode$ = node$.filter(node => node._fqtn === fullyQualifiedTagName)
      const state$ = filteredNode$.flatMapLatest(node => makePlayerEvent$(node).map(toPlayerState))
        .distinctUntilChanged()
        .startWith(driverDefaults())

      return {
        node$: filteredNode$,
        vtree: h(fullyQualifiedTagName,
          Object.assign({}, {[fullyQualifiedTagName]: new Hook(node$)}, properties), children),
        state$,
        controls: controls => Observable.combineLatest(filteredNode$, makeCommand$(controls)),
      }
    }

    return {
      video: createMediaHelper(`video`),
      audio: createMediaHelper(`audio`),
      states$: players => Observable.combineLatest(players.map(player => player.state$)),
      controls: players => controls => {
        Observable.merge(players.map(player =>
          Observable.combineLatest(player.node$, makeCommand$(controls))))
      },
    }
  }

export default makeVideoDriver
