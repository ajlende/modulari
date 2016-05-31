
import {run} from '@cycle/core';
import {makeDOMDriver} from '@cycle/dom';
import makeMediaDriver from './drivers/mediadriver';
import MediaComponent from './components/mediacomponent';

run(MediaComponent, {
  DOM: makeDOMDriver('#app'),
  Player: makeMediaDriver()
});
