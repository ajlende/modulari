// TODO Mopidy Drivers
// http://mopidy.readthedocs.io/en/latest/api/http/http://mopidy.readthedocs.io/en/latest/api/http/

/**
 * messageHandler - Creates a function for creating an Observable that emits WebSocket messages
 *
 * @param {Object} ws - the Mopidy WebSocket
 * @return A function for creating an Observable that emits WebSocket messages
 */
const messageHandler = (ws) => (observable) => {
  // All Mopidy messages and errors go through onmessage
  ws.onmessage = (message) => {
    const data = JSON.parse(message.data)
    if (data.hasOwnProperty(`error`))
      observable.onError({type: `Mopidy`, error: data})
    else
      observable.onNext(data)
  }

  // Very little info is expressed in onerror, so much of it is in onclose
  ws.onerror = (error) => {
    observable.onError({type: `WebSocket`, error})
  }

  // More information is available when the WebSocket closes
  // See http://tools.ietf.org/html/rfc6455#section-7.4.1
  /* eslint-disable complexity */
  ws.onclose = (event) => {
    let reason
    switch (event.code) {
    case 1000:
      reason = `Normal closure, meaning that the purpose for which the connection was established \
                has been fulfilled.`
      break
    case 1001:
      reason = `An endpoint is "going away", such as a server going down or a browser having \
                navigated away from a page.`
      break
    case 1002:
      reason = `An endpoint is terminating the connection due to a protocol error`
      break
    case 1003:
      reason = `An endpoint is terminating the connection because it has received a type of data \
                it cannot accept (e.g., an endpoint that understands only text data MAY send this \
                if it receives a binary message).`
      break
    case 1004:
      reason = `Reserved. The specific meaning might be defined in the future.`
      break
    case 1005:
      reason = `No status code was actually present.`
      break
    case 1006:
      reason = `The connection was closed abnormally, e.g., without sending or receiving a Close \
                control frame`
      break
    case 1007:
      reason = `An endpoint is terminating the connection because it has received data within a \
                message that was not consistent with the type of the message (e.g., non-UTF-8 \
                [http://tools.ietf.org/html/rfc3629] data within a text message).`
      break
    case 1008:
      reason = `An endpoint is terminating the connection because it has received a message that \
                "violates its policy". This reason is given either if there is no other sutible \
                reason, or if there is a need to hide specific details about the policy.`
      break
    case 1009:
      reason = `An endpoint is terminating the connection because it has received a message that \
                is too big for it to process.`
      break
    case 1010: // Note that this status code is not used by the server
      reason = `An endpoint (client) is terminating the connection because it has expected the \
                server to negotiate one or more extension, but the server didn't return them in \
                the response message of the WebSocket handshake. <br /> Specifically, the \
                extensions that are needed are: ${event.reason}`
      break
    case 1011:
      reason = `A server is terminating the connection because it encountered an unexpected \
                condition that prevented it from fulfilling the request.`
      break
    case 1015:
      reason = `The connection was closed due to a failure to perform a TLS handshake (e.g., the \
                server certificate can't be verified).`
      break
    default:
      reason = `The connection was closed for an unknown reason.`
      break
    }

    if (event.code > 1000)
      observable.onError({type: `WSClose`, error: event, reason})
    else
      observable.onNext({event: `websocket_closed`, result: event, reason})

    observable.onCompleted()
  }
  /* eslint-enable complexity */
}

/**
 * createRequest - formats the command and params passed to send to Mopidy
 *
 * @param {string} command - The command to send over the WebSocket
 * @param {Object} [params] - Optional parameters for the command
 */
const createRequest = (scope, command, params) => ({
  jsonrpc: `2.0`,
  id: 1,
  method: `core.${scope}.${command}`,
  params: params || {},
})

/**
 * sendCommand - Creates an onNext function for an Observer of a command stream to control Mopidy
 *
 * @param {Object} ws - the Mopidy WebSocket
 * @return The onNext function for an Observer that sends commands to Mopidy through the WebSocket
 */
const sendCommand = (ws) => (command) => {
  if (command === null) return
  const commandStr = JSON.stringify(command)
  ws.send(commandStr)
}

// export {default as TracklistDriver} from './tracklist-driver'
export {default as makePlaybackDriver} from './playback-driver'
// export {default as makeLibraryDriver} from './library-driver'
// export {default as makePlaylistDriver} from './playlist-driver'
export {default as makeMixerDriver} from './mixer-driver'
// export {default as makeHistoryDriver} from './history-driver'

export {messageHandler, createRequest, sendCommand}
