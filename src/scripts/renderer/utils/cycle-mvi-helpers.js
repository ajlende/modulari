import {Observable} from 'rx'

/**
 * toggle - toggles output event$ when there is a new event on the input event$
 *
 * @param {Observable} event$ - any event stream
 * @return Observable stream of toggled true/false
 */
const toggle = event$ =>
  event$
    .map(ev => Boolean(ev))
    .scan(x => !x)
    .startWith(false)

/**
 * hold - a mreged stream of mousedown and mouseup events mapped to true and false, respectively.
 *
 * @param {Observable} mouseDown$ - mousedown event stream
 * @param {Observable} mouseUp$   - mouseup event stream
 * @return Observable stream of true and false for mousedown and mouseup
 */
const hold = (mouseDown$, mouseUp$) =>
  Observable
    .merge(mouseDown$.map(() => true), mouseUp$.map(() => false))
    .startWith(false)

/**
 * rangeVal - takes an event stream from a range element and returns the value.
 *
 * @param {Observable} range$ - range input event stream
 * @param {number}     first  - the value to start with
 * @return Observable stream of the value of the range input
 */
const rangeVal = (range$, first) =>
  range$.map(ev => ev.target.value).startWith(first)

export {toggle, hold, rangeVal}
