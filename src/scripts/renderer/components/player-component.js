import {Observable} from 'rx';
import isolate from '@cycle/isolate';
import {div} from '@cycle/dom';

import makeHeaderComponent from './header/header-component';

const view = header => Observable.just(
  div('.header', [header])
);

const PlayerComponent = ({DOM}) => {
  const header = makeHeaderComponent({DOM}).DOM;

  const vtree$ = view(header);

  return {
    DOM: vtree$
  };
};

export default sources => isolate(PlayerComponent)(sources);
export {view, PlayerComponent};
