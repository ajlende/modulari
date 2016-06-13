/**
 * cycle-event-helpers.js - A collection of all HTML5 events for use with @cycle/dom.
 *
 * The purpose of this was to make all events checkable for syntax problems by a syntax checker.
 * There is an event exported for every event in the HTML5 standard and can be imported in blocks.
 *
 * Usage example:
 *
 * import {click, mousemove} from 'cycle-event-helpers';
 *
 * function main({DOM}) {
 *   let click$ = click(DOM.select('div'));
 *   let mousemove$ = mousemove(DOM.select('div'));
 *   let mouse$ = click$.merge(mousemove$);
 *   ...
 * }
 *
 * OR
 *
 * import {mouse} from 'cycle-event-helpers';
 *
 * function main({DOM}) {
 *   let click$ = mouse.click(DOM.select('div'));
 *   let mousemove$ = mouse.mousemove(DOM.select('div'));
 *   let mouse$ = click$.merge(mousemove$);
 *   ...
 * }
 *
 * OR
 *
 * import events from 'cycle-event-helpers';
 *
 * function main({DOM}) {
 *   let click$ = events.mouse.click(DOM.select('div'));
 *   let mousemove$ = events.mouse.mousemove(DOM.select('div'));
 *   let mouse$ = click$.merge(mousemove$);
 *   ...
 * }
 */

/* eslint-disable new-cap, no-multi-spaces */
const Event = event => el => el.events(event);

// Misc Events
const error          = Event('error');
const show           = Event('show');
const toggle         = Event('toggle');
export {error, show, toggle};

const miscEvents     = {error, show, toggle};
export {miscEvents as misc};

// Window Event Attributes
// Events triggered for the window object (applies to the <body> tag)
const afterprint     = Event('afterprint');
const beforeprint    = Event('beforeprint');
const beforeunload   = Event('beforeunload');
// const error          = Event('error'); // defined above
const hashchange     = Event('hashchange');
const load           = Event('load');
const message        = Event('message');
const offline        = Event('offline');
const online         = Event('online');
const pagehide       = Event('pagehide');
const pageshow       = Event('pageshow');
const popstate       = Event('popstate');
const resize         = Event('resize');
const storage        = Event('storage');
const unload         = Event('unload');
export {afterprint, beforeprint, beforeunload, hashchange, load, message, offline, online, pagehide, pageshow, popstate, resize, storage, unload};

const windowEvents   = {error, afterprint, beforeprint, beforeunload, hashchange, load, message, offline, online, pagehide, pageshow, popstate, resize, storage, unload};
export {windowEvents as window};

// Form Events
// Events triggered by actions inside a HTML form (applies to almost
// all HTML elements, but is most used in form elements)
const blur           = Event('blur');
const change         = Event('change');
const contextmenu    = Event('contextmenu');
const focus          = Event('focus');
const input          = Event('input');
const invalid        = Event('invalid');
const reset          = Event('reset');
const search         = Event('search');
const select         = Event('select');
const submit         = Event('submit');
export {blur, change, contextmenu, focus, input, invalid, reset, search, select, submit};

const formEvents = {blur, change, contextmenu, focus, input, invalid, reset, search, select, submit};
export {formEvents as form};

// Keyboard Events
// Events triggered by the keyboard
const keydown        = Event('keydown');
const keypress       = Event('keypress');
const keyup          = Event('keyup');
export {keydown, keypress, keyup};

const keyboardEvents = {keydown, keypress, keyup};
export {keyboardEvents as keyboard};

// Mouse Events
// Events triggered by a mouse, or similar user actions
const click          = Event('click');
const dblclick       = Event('dblclick');
const drag           = Event('drag');
const dragend        = Event('dragend');
const dragenter      = Event('dragenter');
const dragleave      = Event('dragleave');
const dragover       = Event('dragover');
const dragstart      = Event('dragstart');
const drop           = Event('drop');
const mousedown      = Event('mousedown');
const mousemove      = Event('mousemove');
const mouseout       = Event('mouseout');
const mouseover      = Event('mouseover');
const mouseup        = Event('mouseup');
const mousewheel     = Event('mousewheel');
const scroll         = Event('scroll');
const wheel          = Event('wheel');
export {click, dblclick, drag, dragend, dragenter, dragleave, dragover, dragstart, drop, mousedown, mousemove, mouseout, mouseover, mouseup, mousewheel, scroll, wheel};

const mouseEvents    = {click, dblclick, drag, dragend, dragenter, dragleave, dragover, dragstart, drop, mousedown, mousemove, mouseout, mouseover, mouseup, mousewheel, scroll, wheel};
export {mouseEvents as mouse};

// Clipboard Events
// Events truggered by copying and pasting
const copy           = Event('copy');
const cut            = Event('cut');
const paste          = Event('paste');
export {copy, cut, paste};

const clipboardEvents = {copy, cut, paste};
export {clipboardEvents as clipboard};

// Media Events
// Events triggered by medias like videos, images and audio (applies
// to all HTML elements, but is most common in media elements, like
// <audio>, <embed>, <img>, <object>, and <video>)
const abort          = Event('abort');
const canplay        = Event('canplay');
const canplaythrough = Event('canplaythrough');
const cuechange      = Event('cuechange');
const durationchange = Event('durationchange');
const emptied        = Event('emptied');
const ended          = Event('ended');
// const error          = Event('error'); // defined above
const loadeddata     = Event('loadeddata');
const loadedmetadata = Event('loadedmetadata');
const loadstart      = Event('loadstart');
const pause          = Event('pause');
const play           = Event('play');
const playing        = Event('playing');
const progress       = Event('progress');
const ratechange     = Event('ratechange');
const seeked         = Event('seeked');
const seeking        = Event('seeking');
const stalled        = Event('stalled');
const suspend        = Event('suspend');
const timeupdate     = Event('timeupdate');
const volumechange   = Event('volumechange');
const waiting        = Event('waiting');
export {abort, canplay, canplaythrough, cuechange, durationchange, emptied, ended, loadeddata, loadedmetadata, loadstart, pause, play, playing, progress, ratechange, seeked, seeking, stalled, suspend, timeupdate, volumechange, waiting};

const mediaEvents    = {error, abort, canplay, canplaythrough, cuechange, durationchange, emptied, ended, loadeddata, loadedmetadata, loadstart, pause, play, playing, progress, ratechange, seeked, seeking, stalled, suspend, timeupdate, volumechange, waiting};
export {mediaEvents as media};

const events = {
  window: windowEvents,
  form: formEvents,
  keyboard: keyboardEvents,
  mouse: mouseEvents,
  clipboard: clipboardEvents,
  media: mediaEvents,
  misc: miscEvents
};

export default events;
/* eslint-enable new-cap, no-multi-spaces */
