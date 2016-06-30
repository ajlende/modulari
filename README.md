# Modulari

Modulari (Latin) - to modulate, to beat time, to measure, to regulate (as in music :wink::musical_note:)

Eventually the goal is for it to be a full-featured client for [Mopidy](https://www.mopidy.com) built with [Electron](http://electron.atom.io) and [Cycle.js](http://cycle.js.org).

Design is inspired by [museeks](https://github.com/KeitIG/museeks), an electron based music player that plays local files directly.

This project is in its infancy, so many things will be broken or not exist at the moment.

## Progress so far...
![Mopidy-v0.0.1-2](screenshots/Mopidy-v0.0.1-2.png)

Currently you can only control the playback with the previous, play/payse, and next buttons. The current song info and the current tracklist (queue) is also shown.

Recently Cycle.js released a large update that broke some things. Since I haven't been keeping version numbers on my `package.json`, you might need to manually test the versions to see which ones work (just for the `@cycle` stuff). It's also going to take me some time to migrate to the new stuff, so expect to see Rx 4 replaced with something better. I'm between [RxJS 5](http://reactivex.io/rxjs/) and [xstream](http://staltz.com/xstream/) at the moment.

## Usage
First, make sure that [Mopidy](https://www.mopidy.com) is installed and running on your computer with the [Mopidy-HTTP](https://docs.mopidy.com/en/latest/ext/http/) extension running. See the [Mopidy Docs](https://docs.mopidy.com/en/latest/) for how to do that.

At the moment you need to add songs to your playlist with another [Mopidy Client](https://docs.mopidy.com/en/latest/clients/http/)

Next, run the following in the `mopidy` directory:

```sh
$ npm install -g electron-prebuilt less eslint
$ npm install
$ npm run less
$ npm start
```
