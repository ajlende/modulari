module NowPlaying exposing (..)

import Html exposing (div, text, strong, Html)
import Html.Attributes exposing (class)

import Mopidy.DataModels exposing (Track, Artist, Album)

-- MODEL

type alias Song =
  { name : String
  , artist : Maybe String
  , album : Maybe String
  , duration : Maybe Int -- Mopidy doesn't guarantee a length
  , position : Maybe Int -- which means this can't be guaranteed either
  }

type alias Model =
    Maybe Song

artistName : Maybe (List Artist) -> Maybe String
artistName artists =
  Maybe.map
    (\alist ->
      Maybe.map
        (\a -> a.name)
        <| List.head alist
    ) artists
  |> (\m ->
    case m of
      Just (Just val) ->
        Just val
      _ ->
        Nothing
  )

albumName : Maybe Album -> Maybe String
albumName album =
  Maybe.map (\a -> a.name) album

init : Maybe Track -> Model
init track =
  Maybe.map
    (\t ->
      (Song
        t.name
        (artistName t.artists)
        (albumName t.album)
        t.duration
        (Just 0)
      )
    )
    track

-- UPDATE

-- TODO : Basically this is going to depend on what we hear from Mopidy Events


-- VIEW

songInfo : Model -> List (Html msg)
songInfo model =
  case model of
    Just song ->
      [ strong [] [ text song.name ]
      , text "by"
      , strong [] [ text (Maybe.withDefault "Unknown Artist" song.artist) ]
      , text "on"
      , strong [] [ text (Maybe.withDefault "Unknown Album" song.album) ]
      ]

    Nothing ->
      [ text "Modulari" ]

view : Model -> Html Never
view model =
    div [ class "now-playing" ]
      [ div [ class "song-info" ]
          (songInfo model)
      ]


-- SUBSCRIPTIONS
