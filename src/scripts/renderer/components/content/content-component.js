import {Observable} from 'rx'
import isolate from '@cycle/isolate'
import {table, thead, tbody, tr, th, td, span} from '@cycle/dom'

const view = () => Observable.just(
  table(`.table.table-striped.table-hover`, [
    thead([
      tr([
        th(``),
        th(`Track`),
        th(`Duration`),
        th(`Artist`),
        th(`Album`),
      ]),
    ]),
    tbody([
      tr([
        td(span(`.fa.fa-volume-up`)),
        td(`San Francisco`),
        td(`2:50`),
        td(`The Mowgli's`),
        td(`Sound the Drum`),
      ]),
      tr([
        td(``),
        td(`Dear Maria, Count Me In`),
        td(`3:02`),
        td(`All Time Low`),
        td(`So Wrong, It's Right`),
      ]),
      tr([
        td(``),
        td(`Hold It In`),
        td(`3:28`),
        td(`Jukebox the Ghost`),
        td(`Let Live & Let Ghosts`),
      ]),
      tr([
        td(``),
        td(`From a Mountain in the Middle of the Cabins`),
        td(`3:02`),
        td(`Panic! at the Disco`),
        td(`Pretty. Odd.`),
      ]),
      tr([
        td(``),
        td(`Go to Sleep. (Little man Being Erased.)`),
        td(`3:21`),
        td(`Radiohead`),
        td(`Hail to the Theif. (The Gloaming.)`),
      ]),
      tr([
        td(``),
        td(`Ghowstwriter`),
        td(`5:17`),
        td(`RJD2`),
        td(`Deadringer`),
      ]),
      tr([
        td(``),
        td(`Best of 2014 Album Mix`),
        td(`1:50:36`),
        td(`Various Artists`),
        td(`Monstercat: Best of 2014 Album Mix`),
      ]),
    ]),
  ])
)

const ContentComponent = ({DOM}) => {
  return {
    DOM: view(DOM),
  }
}

export default (sources) => isolate(ContentComponent)(sources)
export {view, ContentComponent}
