
import {run} from '@cycle/core';
import {makeDOMDriver} from '@cycle/dom';

import makeVideoDriver from './drivers/video-driver';

import VideoComponent from './components/video-component';

run(VideoComponent, {
  DOM: makeDOMDriver('#app'),
  Player: makeVideoDriver()
});
