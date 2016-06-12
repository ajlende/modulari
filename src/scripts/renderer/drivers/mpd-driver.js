import {Observable} from 'rx';
import Mpd from 'mpd';

const makeMPDDriver = (port, host) =>
  source$ => {
    let mpd = new Mpd();
    let client = mpd.connect({port, host});
    source$.subscribe(source => client.sendCommand(source));
    return Observable.create(observer => {
      client.on('ready', () => {
        console.log(`driver | ready`);
        observer.onNext('ready');
      });
      client.on('system', name => {
        console.log(`driver | update: ${name}`);
        observer.onNext(name);
      });
      client.on('system-player', () => {
        client.sendCommand(mpd.cmd('status', []), (err, msg) => {
          if (err) {
            console.log(`driver | error: ${err}`);
            observer.onError(err);
          } else {
            console.log(`driver | ${msg}`);
            observer.onNext(msg);
          }
        });
      });
    }).share();
  };

export default makeMPDDriver;
