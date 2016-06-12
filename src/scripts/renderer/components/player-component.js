import {Observable} from 'rx';
import {div} from '@cycle/dom';

import makeHeaderComponent from './header/header-component';

/**
 * view - visually represent state from the model
 *
 * @param  {Object} state$ Observable
 * @return {Object} Observable of VTree as the DOM Driver Sink
 */
const view = headerVTree =>
  div('.header', [headerVTree]);

/**
 * PlayerComponent - combine model view and intent to create the component
 *
 * @param  {Object} Sources (read effects/incomming messages)
 * @return {Object} Sinks (write effects/outgoing messages)
 */
const PlayerComponent = ({DOM}) => {
  const Header = makeHeaderComponent({DOM});

  const vtree$ = Observable.just(
    view(Header.DOM)
  );

  return {
    DOM: vtree$
  };
};

export default PlayerComponent;
