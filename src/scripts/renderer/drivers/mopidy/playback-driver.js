// http://mopidy.readthedocs.io/en/latest/api/core/#playback-controller

import {Observable} from 'rx'

const makePlaybackDriver = (ws) =>
  (controls$) => {
    controls$.subscribe((controls) => {
      if (controls === null) return
      const controlStr = JSON.stringify(controls)
      console.log(controlStr)
      ws.send(controlStr)
    })

    const event$ = Observable.create((observable) => {
      ws.onmessage = (message) => {
        const data = JSON.parse(message.data)
        if (data.hasOwnProperty(`error`))
          observable.onError(data)
        else
          observable.onNext(data)
        console.log(JSON.parse(message.data))
      }
      ws.onerror = (error) => {
        observable.onError(error)
        console.error(error)
      }
    }).share().filter((res) => res.hasOwnProperty(`event`) && res.event.indexOf(`playback`) !== -1)

    return {
      event$,
    }
  }

export default makePlaybackDriver
