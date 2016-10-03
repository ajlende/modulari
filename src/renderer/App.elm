module App exposing (..)

import Mopidy exposing (..)
import Html.App


main : Program Never
main =
    Html.App.program
        { init = init
        , update = update
        , view = view
        , subscriptions = (\_ -> Sub.none)
        }



-- Model


type alias Model =
    { playlist : Playlist
    , current : Maybe Track
    }



-- Update
-- View
