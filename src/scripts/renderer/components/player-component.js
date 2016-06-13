import {Observable} from 'rx';
import isolate from '@cycle/isolate';
import {div} from '@cycle/dom';

import makeHeaderComponent from './header/header-component';
import makeTestComponent from './header/test-event-component';

/**
 * view - visually represent state from the model
 *
 * @param  {Object} state$ Observable
 * @return {Object} Observable of VTree as the DOM Driver Sink
 */
const view = (header, test) => Observable.just(
  div('.header', [
    header,
    test
  ])
);

/**
 * PlayerComponent - combine model view and intent to create the component
 *
 * @param  {Object} Sources (read effects/incomming messages)
 * @return {Object} Sinks (write effects/outgoing messages)
 */
const PlayerComponent = ({DOM}) => {
  const header = makeHeaderComponent({DOM}).DOM;
  const test = makeTestComponent({DOM}).DOM;

  // all intent and state are covered in subcomponents
  const vtree$ = view(header, test); // add components here as needed

  return {
    DOM: vtree$
  };
};

// export default sources => isolate(PlayerComponent)(sources);
export default PlayerComponent
export {view, PlayerComponent};
