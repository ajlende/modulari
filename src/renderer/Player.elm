module Player exposing (..)

import Html exposing (div, text, Html)
import Html.Attributes exposing (class)

import Header


-- MODEL

type alias Model =
  { header : Header.Model
  }

init : Model
init =
  { header = Header.init
  }

-- UPDATE

-- TODO


-- VIEW

view : Model -> Html Never
view model =
  div [ class "wrapper" ]
    [ (Header.view model.header)
    ]


-- SUBSCRIPTIONS
