# Modulari

Modulari (Latin) - to modulate, to beat time, to measure, to regulate (as in music :wink::musical_note:)

Eventually the goal is for it to be a full-featured client for [Mopidy](https://www.mopidy.com) built with [Electron](http://electron.atom.io) and [Elm](http://elm-lang.org).

Design is inspired by [museeks](https://github.com/KeitIG/museeks), an electron based music player that plays local files directly.

This project is in its infancy, so many things will be broken or not exist at the moment.


## Progress so far...

Semi-recently Cycle.js had a large update that broke everything which meant that I was going to need to re-write everything using the xstream library instead of RxJS. There were some things that I really liked about Cycle.js, but I have since found a relatively new language called Elm that I am switching to instead. Cycle.js was influenced by the Elm architecture, so the ideas are very similar. However, with Elm there are fewer decisions that need to be made regarding libraries, testing, architecture, and other stuff which can be fatiguing in Javascript. Elm also has a syntax based off of the ML family of languages which includes Haskell, OCaml, and F#. Along with the syntax change is a nice type system that helps prevent errors in your code.

This change is going to take some time as it's an entirely new language for the project, but I think that in the long run it will be good to learn a more purely functional language.
