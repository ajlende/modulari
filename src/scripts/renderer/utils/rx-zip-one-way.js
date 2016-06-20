import {Observable, SingleAssignmentDisposable, CompositeDisposable} from 'rx'

/**
 * zipOneWayWithDefault - Much like Rx.Observable.zip except this one only zips one direction. If a
 *                        response event is made without a corresponding command, a default command
 *                        value is used.
 *
 * Marble Diagram:
 * response$ --r0-----r1------r2-----r3-r4---r5--->
 *  command$ ------c0--------------c1-c2---------->
 *             vv  vv vv     vv    vvvvvvv   vv
 *           ~*~*~*~*~zipOneWayWithDefault~*~*~*~*~
 *             vv     vv     vv      vv vv   vv
 *   result$ --cx-----c0------cx-----c1-c2---cx--->
 *             r0     r1      r2     r3 r4   r5
 *
 * Usage:
 * ~~~
 * const first$ = Observable.interval(300).take(5).map((val) => `r${val}`)
 * const second$ = Observable.interval(700).take(2).map((val) => `c${val}`)
 * const zipped$ = zipOneWayWithDefault(first$, second$, `x`, (first, second) => ({first, second}))
 *
 * const subscription = zipped$.subscribe(
 *   (val) => console.log(`Next: ${val}`),
 *   (err) => console.log(`Error: ${err}`),
 *   () => console.log(`Completed`)
 * )
 *
 * // Next: {first: "r0", second: "cx"}
 * // Next: {first: "r1", second: "cx"}
 * // Next: {first: "r2", second: "c0"}
 * // Next: {first: "r3", second: "cx"}
 * // Next: {first: "r4", second: "c1"}
 * // Completed
 * ~~~
 *
 * @param {Object} response$ - The Observable stream to act on
 * @param {Object} command$ - The Observable stream to pair with the responses
 * @param {*} defaultCommand - The default value to fill in when a command wasn't just called
 * @param {function} defaultCommand - The default value to fill in when a command wasn't just called
 *
 * @callback function
 * @param {*} response - The current response being handled
 * @param {*=defaultCommand} command - The command associated with the response or default command
 *
 */
/* eslint-disable max-params */
const zipOneWayWithDefault = (response$, command$, defaultCommand, selector) =>
  Observable.create((observer) => {
    // For holding the commands as the come in
    const commandQueue = []

    // Combine the response with the latest command or some default value
    const mappedResponse$ = response$.map((response) =>
      selector(
        response,
        commandQueue.length ? commandQueue.shift() : defaultCommand
      )
    )

    // The observer is watching for responses and will output the combined command + response onNext
    const responseSubscription = new SingleAssignmentDisposable()
    responseSubscription.setDisposable(mappedResponse$.subscribe(observer))

    // When we get a command, push it to the commandQueue and have the observer warch for errors
    const commandSubscription = new SingleAssignmentDisposable()
    commandSubscription.setDisposable(
      command$.subscribe(
        (command) => commandQueue.push(command),
        observer.onError.bind(observer)
      )
    )

    // Return the combined response and command subscriptions
    return new CompositeDisposable(responseSubscription, commandSubscription)
  })
Observable.zipOneWayWithDefault = zipOneWayWithDefault
/* eslint-enable max-params */

export {zipOneWayWithDefault}
