import {Observable} from 'rx';

/**
 * toggle - toggles output event$ when there is a new event on the input event$
 *
 * @param event$ {Observable} any event stream
 * @return Observable stream of toggled true/false
 */
const toggle = event$ =>
  event$
    .map(ev => Boolean(ev))
    .scan(x => !x)
    .startWith(false);

/**
 * hold - a mreged stream of mousedown and mouseup events mapped to true and false, respectively.
 *
 * @param mouseDown$ {Observable} mousedown event stream
 * @param mouseUp$ {Observable} mouseup event stream
 * @return Observable stream of true and false for mousedown and mouseup
 */
const hold = (mouseDown$, mouseUp$) =>
  Observable
    .merge(mouseDown$.map(() => true), mouseUp$.map(() => false))
    .startWith(false);

export {toggle, hold};
