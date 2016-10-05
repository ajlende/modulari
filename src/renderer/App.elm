port module App exposing (..)

import Mopidy.DataModels exposing (..)
import Mopidy.CoreEvents exposing (..)
import Mopidy.Playback exposing (..)
import Html exposing (..)
import Html.App
import Json.Decode exposing (Value, decodeValue)
import Debug


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
            ( model, Cmd.none )

        TrackPlaybackPaused tlTrack timePosition ->
            ( model, Cmd.none )

        TrackPlaybackResumed tlTrack timePosition ->
            ( model, Cmd.none )

        TrackPlaybackStarted tlTrack ->
            ( model, Cmd.none )

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
    div []
        [ text (toString model.volume)
        ]



-- Subscriptions


port mopidyEventSub : (Value -> msg) -> Sub msg


subscriptions : Model -> Sub Msg
subscriptions model =
    mopidyEventSub CoreEventVal
