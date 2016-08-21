import {Observable} from 'rx'
import isolate from '@cycle/isolate'
import {div, form, label, input, i, option, section, select, textarea} from '@cycle/dom'

const view = () => Observable.just(
  section(`.sample-form.container`, [
    form(`.pt-10`, [
      div(`.form-group`, [
        label(`.form-label`, {for: `input-example-1`}, `Name`),
        input(`#input-example-1.form-input`, {type: `text`, placeholder: `Name`}),
      ]),
      div(`.form-group`, [
        label(`.form-label`, `Gender`),
        label(`.form-radio`, [
          input({type: `radio`, name: `gender`, checked: true}),
          i(`.form-icon`),
          `Male`,
        ]),
        label(`.form-radio`, [
          input({type: `radio`, name: `gender`, checked: false}),
          i(`.form-icon`),
          `Female`,
        ]),
      ]),
      div(`.form-group`, [
        select(`.form-select`, [
          option(`Choose an option`),
          option(`Slack`),
          option(`Hipchat`),
          option(`Skype`),
        ]),
      ]),
      div(`.form-group`, [
        label(`.form-switch`, [
          input({type: `checkbox`}),
          i(`.form-icon`),
          `Send me emails with new and tips`,
        ]),
      ]),
      div(`.form-group`, [
        label(`.form-label`, {for: `input-example-2`}, `Message`),
        textarea(`#input-example-2.form-input`, {placeholder: `Enter a message`, rows: `3`}),
      ]),
      div(`.form-group`, [
        label(`.form-checkbox`, [
          input({type: `checkbox`}),
          i(`.form-icon`),
          `Remember me`,
        ]),
      ]),
    ]),
  ])
)

const FormComponent = ({DOM}) => {
  return {
    DOM: view(DOM),
  }
}

export default (sources) => isolate(FormComponent)(sources)
export {view, FormComponent}
