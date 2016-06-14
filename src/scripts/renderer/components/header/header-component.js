import {Observable} from 'rx';

import {div} from '@cycle/dom';
import isolate from '@cycle/isolate';

import makeControlsComponent from './controls-component';
import makeSelectorComponent from './selector-component';

const view = (selector, controls) => Observable.just(
  div('.grd.bg--dark-gray.fnt--light-gray', [
    div('.grd-row', [
      selector,
      controls
    ])
  ])
);

const HeaderComponent = ({DOM}) => {
  const selector = makeSelectorComponent({DOM}).DOM;
  const controls = makeControlsComponent({DOM}).DOM;

  const vtree$ = view(selector, controls);

  return {
    DOM: vtree$
  };
};

export default sources => isolate(HeaderComponent)(sources);
export {view, HeaderComponent};
