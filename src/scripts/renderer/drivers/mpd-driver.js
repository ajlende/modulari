import {Observable} from 'rx'
import Mpd from 'mpd'

const makeMPDDriver = (port, host) => {
  const mpd = new Mpd()
  const client = mpd.connect({port, host})

  const setupClient = (observer) => {
    // when MPD connects
    client.on(`ready`, () => {
      console.log(`driver | ready`)
      observer.onNext(`ready`)
    })

    // when there is a system message
    client.on(`system`, (name) => {
      console.log(`driver | update: ${name}`)
      observer.onNext(name)
    })

    // when there is a player related message
    client.on(`system-player`, () => {
      client.sendCommand(mpd.cmd(`status`, []), (err, msg) => {
        if (err) {
          console.log(`driver | error: ${err}`)
          observer.onError(err)
        } else {
          console.log(`driver | ${msg}`)
          observer.onNext(msg)
        }
      })
    })
  }

  return (source$) => {
    source$.subscribe((source) => client.sendCommand(source))

    return Observable.create((observer) => setupClient(observer)).share()
  }}

export default makeMPDDriver
