import {span, div} from '@cycle/dom';
import isolate from '@cycle/isolate';
import {Observable} from 'rx';

import makeSelectorComponent from './selector-component';

/**
 * view - visually represent state from the model
 *
 * @param  {Object} state$ Observable
 * @return {Object} vtree$ Observabe as the DOM Driver Sink
 */
const view = selector => Observable.just(
  div('.grd.bg--dark-gray.fnt--light-gray', [
    div('.grd-row', [
      selector
    ])
  ])
);

/**
 * PlayerComponent - combine model view and intent to create the component
 *
 * @param  {Object} Sources
 * @return {Object} Sinks
 */
const HeaderComponent = ({DOM}) => {
  // Instantiate external compnents to use DOM
  const selector = makeSelectorComponent({DOM}).DOM;

  // Model-View-Intent
  const vtree$ = view(selector);

  // Sink
  return {
    DOM: vtree$
  };
};

// export default sources => isolate(HeaderComponent)(sources);
export default HeaderComponent;
export {view, HeaderComponent};
