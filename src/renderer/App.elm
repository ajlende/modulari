port module App exposing (..)

import Mopidy.DataModels exposing (..)
import Mopidy.CoreEvents exposing (..)
import Mopidy.Playback exposing (..)
import Html exposing (..)
import Html.Attributes as A exposing (class, id, type', placeholder, value)
import Html.App
import Json.Decode exposing (Value, decodeValue)
import Debug
import String


main : Program Never
main =
    Html.App.program
        { init = ( init, Cmd.none )
        , update = update
        , view = view
        , subscriptions = subscriptions
        }



-- Model


type alias Model =
    { currentSong : Maybe Track
    , volume : Int
    }


init : Model
init =
    { currentSong = Nothing
    , volume = 0
    }



-- Update


type Msg
    = NoOp
    | CoreEventMsg MopidyCoreEvent
    | CoreEventVal Value
    | MsgForPlayback PlaybackMsg


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        NoOp ->
            ( model, Cmd.none )

        MsgForPlayback msg ->
            updatePlayback msg model

        CoreEventVal value ->
            resultUpdateModel model (decodeValue mopidyEvent value)

        CoreEventMsg msg ->
            updateCoreEvent msg model


updatePlayback : PlaybackMsg -> Model -> ( Model, Cmd Msg )
updatePlayback msg model =
    case msg of
        Play tlid ->
            ( model, play tlid )

        Next ->
            ( model, next () )

        Previous ->
            ( model, previous () )

        Stop ->
            ( model, stop () )

        Pause ->
            ( model, pause () )

        Resume ->
            ( model, resume () )

        Seek timePosition ->
            ( model, seek timePosition )


updateCoreEvent : MopidyCoreEvent -> Model -> ( Model, Cmd Msg )
updateCoreEvent msg model =
    case msg of
        MuteChanged mute ->
            ( model, Cmd.none )

        OptionsChanged ->
            ( model, Cmd.none )

        PlaybackStateChanged oldState newState ->
            ( model, Cmd.none )

        PlaylistChanged playlist ->
            ( model, Cmd.none )

        PlaylistDeleted uri ->
            ( model, Cmd.none )

        PlaylistsLoaded ->
            ( model, Cmd.none )

        Seeked timePosition ->
            ( model, Cmd.none )

        StreamTitleChanged title ->
            ( model, Cmd.none )

        TrackPlaybackEnded tlTrack timePosition ->
            ( { model | currentSong = Just tlTrack.track }, Cmd.none )

        TrackPlaybackPaused tlTrack timePosition ->
            ( { model | currentSong = Just tlTrack.track }, Cmd.none )

        TrackPlaybackResumed tlTrack timePosition ->
            ( { model | currentSong = Just tlTrack.track }, Cmd.none )

        TrackPlaybackStarted tlTrack ->
            ( { model | currentSong = Just tlTrack.track }, Cmd.none )

        TracklistChanged ->
            ( model, Cmd.none )

        VolumeChanged volume ->
            ( { model | volume = volume }, Cmd.none )


resultUpdateModel : Model -> Result String MopidyCoreEvent -> ( Model, Cmd Msg )
resultUpdateModel model result =
    case result of
        Result.Ok event ->
            Debug.log (toString event) updateCoreEvent event model

        Result.Err error ->
            Debug.log error ( model, Cmd.none )



-- View


view : Model -> Html Msg
view model =
    let
        currentInfo =
            case model.currentSong of
                Just track ->
                    let
                        name =
                            track.name

                        artists =
                            String.join "," (List.map (\a -> a.name) track.artists)

                        album =
                            track.album.name
                    in
                        [ strong []
                            [ text name ]
                        , text " by "
                        , strong []
                            [ text artists ]
                        , text " on "
                        , strong []
                            [ text album ]
                        ]

                Nothing ->
                    [ text "Modulari" ]

        volume =
            toString model.volume

        volumeIcon =
            if model.volume > 70 then
                "fa-volume-up"
            else if model.volume > 0 then
                "fa-volume-down"
            else
                "fa-volume-off"
    in
        div [ class "wrapper" ]
            [ header [ class "navbar" ]
                [ section [ class "navbar-section" ]
                    [ div [ class "selector" ]
                        [ button [ class "btn btn-link btn-sm" ]
                            [ i [ class "icon fa fa-navicon text-color-info" ]
                                []
                            ]
                        ]
                    , div [ class "controls" ]
                        [ button [ class "btn btn-link btn-sm", id "previous" ]
                            [ i [ class "icon fa fa-fw fa-backward" ]
                                []
                            ]
                        , button [ class "btn btn-link btn-sm", id "play-pause" ]
                            [ i [ class "icon fa fa-fw fa-play" ]
                                []
                            ]
                        , button [ class "btn btn-link btn-sm", id "next" ]
                            [ i [ class "icon fa fa-fw fa-forward" ]
                                []
                            ]
                        , div [ class "volume" ]
                            [ button [ class "btn btn-link btn-sm" ]
                                [ i [ class ("icon fa fa-fw " ++ volumeIcon) ]
                                    []
                                ]
                            , span []
                                [ text "volume" ]
                            , input [ class "vertical abs block", A.max "100", A.min "0", type' "range", value volume ]
                                []
                            ]
                        ]
                    ]
                , section [ class "navbar-section" ]
                    [ div [ class "now-playing" ]
                        [ div [ class "song-info" ]
                            currentInfo
                        , div [ class "song-length" ]
                            [ text "current/duration" ]
                        ]
                    ]
                , section [ class "navbar-section" ]
                    [ div [ class "queue" ]
                        [ button [ class "btn btn-link btn-sm" ]
                            [ i [ class "icon fa fa-list text-color-info" ]
                                []
                            ]
                        ]
                    , div [ class "search" ]
                        [ input [ class "form-input input-inline", placeholder "search" ]
                            []
                        ]
                    ]
                ]
            ]



-- Subscriptions


port mopidyEventSub : (Value -> msg) -> Sub msg


subscriptions : Model -> Sub Msg
subscriptions model =
    mopidyEventSub CoreEventVal
