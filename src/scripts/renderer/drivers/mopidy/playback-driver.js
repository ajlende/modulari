// http://mopidy.readthedocs.io/en/latest/api/core/#playback-controller

import {Observable} from 'rx'

const makePlaybackDriver = (ws) =>
  (controls$) => {
    controls$.subscribe((controls) => ws.send(JSON.stringify(controls)))

    const event$ = Observable.create((observable) => {
      ws.onmessage = (message) => {
        observable.onNext(JSON.parse(message.data))
        console.log(JSON.parse(message.data))
      }
      ws.onerror = (error) => {
        observable.onError(error)
        console.error(error)
      }
    }).share()
    .filter((res) => res.hasOwnProperty(`event`) && res.event.indexOf(`playback`) !== -1)

    return {
      event$,
    }
  }

export default makePlaybackDriver
