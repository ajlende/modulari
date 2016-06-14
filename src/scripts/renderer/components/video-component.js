import {h} from '@cycle/dom';
import {Observable} from 'rx';
import formatTime from '../utils/format-time';
import {mousemove, click, input} from '../utils/cycle-event-helpers';

const volumeIcon = volume => {
  let icon = '';
  if (volume === 0) {
    icon = 'off';
  } else if (volume < 70) {
    icon = 'down';
  } else {
    icon = 'up';
  }
  return icon;
};

const intent = DOM => ({
  mouse: mousemove(DOM.select('.Player')),
  playToggle: click(DOM.select('.PlayToggle')).merge(click(DOM.select('.Video'))),
  seek: input(DOM.select('.Seekbar')).map(e => e.target.value),
  volume: input(DOM.select('.Volume')).map(e => e.target.value)
});

const model = ({mouse, playToggle, input, seek}, video) => ({
  showBar: mouse.map(() => true)
    .merge(mouse.startWith(0)
      .debounce(500)
      .map(() => false))
    .startWith(true)
    .distinctUntilChanged(),
  playing: playToggle.startWith(false).scan(x => !x),
  duration: video.state$.pluck('duration'),
  position: video.state$.pluck('position'),
  volume: video.state$.pluck('volume'),
  video
});

const view = ({showBar, playing, duration, position, volume, video}) =>
    Observable.combineLatest(showBar, playing, duration, position, volume,
        (showBar, playing, duration, position, volume) =>
            h('.Player', [
              video.vtree,
              h(showBar ? 'div.controls' : 'div.controls.hidden', [
                h('i.PlayToggle.fa' + (playing ? '.fa-pause' : '.fa-play')),
                h('input.Seekbar', {type: 'range', min: 0, max: duration, value: position}),
                h('.Seektime', `${formatTime(position | 0)} / ${formatTime(duration | 0)}`),
                h('input.Volume', {type: 'range', min: 0, max: 100, value: volume}),
                h('i.VolumeIndicator.fa.fa-volume-' + volumeIcon(volume))
              ])
            ])
    );

const MediaComponent = ({DOM, Player}) => {
  let video = Player.video('.Video', {src: 'http://www.sample-videos.com/video/mp4/720/big_buck_bunny_720p_50mb.mp4'});
  let actions = intent(DOM);
  let data = model(actions, video);

  return {
    DOM: view(data),
    Player: video.controls({
      play: data.playing.filter(x => x),
      pause: data.playing.filter(x => !x),
      position: actions.seek,
      volume: actions.volume
    })
  };
};

export default MediaComponent;
