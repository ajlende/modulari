module Header exposing (..)

import Html exposing (header, section, Html)
import Html.Attributes exposing (class)

-- import Controls
-- import Selector
-- import Volume
-- import MusicQueue
-- import MusicSearch
import NowPlaying

-- MODEL

type alias Model =
  { nowPlaying : NowPlaying.Model
  }
{- Eventually will look like this
  { selector : Selector.Model
  , controls : Controls.Model
  , volume : Volume.Model
  , nowPlaying : NowPlaying.Model
  , musicQueue : MusicQueue.Model
  , musicSearch : MusicSearch.Model
  }
-}

init : Model
init =
  { nowPlaying = NowPlaying.init Maybe.Nothing
  }

-- UPDATE

-- TODO


-- VIEW

view : Model -> Html Never
view model =
  header [ class "navbar" ]
    [ section [ class "navbar-section" ]
        [ (NowPlaying.view model.nowPlaying)
        ]
    ]
{-- Eventually will look like this
  header [ class "navbar" ]
    [ section [ class "navbar-section" ]
        [ (Selector.view model.selector)
        , (Controls.view model.controls)
        , (Volume.view model.volume)
        ]
    , section [ class "navbar-section" ]
        [ NowPlaying.view
        ]
    , section [ class "navbar-section" ]
        [ MusicQueue.view
        , MusicSearch.view
        ]
    ]
--}


-- SUBSCRIPTIONS
