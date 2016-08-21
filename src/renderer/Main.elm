module Main exposing (..)

import Html.App

import Player

main : Program Never
main =
  Html.App.program
    { init = (Player.init, Cmd.none)
    , update = (\_ model -> (model, Cmd.none))
    , view = Player.view
    , subscriptions = (\_ -> Sub.none)
    }
