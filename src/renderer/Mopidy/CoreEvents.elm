port module Mopidy.CoreEvents
    exposing
        ( MopidyCoreEvent(..)
        , mopidyEvent
        , decodeMopidyEvent
        )

{-| A collection of Mopidy Core Events

[Mopidy Docs](https://docs.mopidy.com/en/latest/api/core/#core-events)

# Mopidy Core Events

@docs MopidyCoreEvent

## Decoding Mopidy Core Events

@docs mopidyEvent

### Helper Decoders

@docs decodeMopidyEvent
-}

import Json.Decode exposing (..)
import Json.Decode.Pipeline exposing (..)
import Mopidy.DataModels exposing (..)


{-| Union type for all event messages that may come from Mopidy.

## TrackPlaybackPaused

Called whenever track playback is paused.

Arguments:

> `Mopidy.DataModels.TlTrack` tlTrack - The track that was playing when
>     playback paused.
>
> `Int` timePosition - The time position in milliseconds.


## TrackPlaybackResumed

Called whenever track playback is resumed.

Arguments:

> `Mopidy.DataModels.TlTrack` tlTrack - The track that was playing when
>     playback resumed.
>
> `Int` timePosition - The time position in milliseconds.


## TrackPlaybackStarted

Called whenever a new track starts playing.

Arguments:

> `Mopidy.DataModels.TlTrack` tlTrack - The track that just started playing.


## TrackPlaybackEnded

Called whenever playback of a track ends.

Arguments:

> `Mopidy.DataModels.TlTrack` tlTrack - Rhe track that was played before
>     playback stopped.
>
> `Int` timePosition - The time position in milliseconds.


## PlaybackStateChanged

Called whenever playback state is changed.

Arguments:

> `Mopidy.CoreEvents.PlaybackState` oldState - The state before the change.
>
> `Mopidy.CoreEvents.PlaybackState` newState - The state after the change.


## TracklistChanged

Called whenever the tracklist is changed.


## PlaylistsLoaded

Called when playlists are loaded or refreshed.


## PlaylistChanged

Called whenever a playlist is changed.

Arguments:

> `Mopidy.DataModels.Playlist` playlist - The changed playlist.


## PlaylistDeleted

Called whenever a playlist is deleted.

Arguments:

> `String` uri - The URI of the deleted playlist.


## OptionsChanged

Called whenever an option is changed.


## VolumeChanged

Called whenever the volume is changed.

Arguments:

> `Int` volume - The new volume in the range [0..100].


## MuteChanged

Called whenever the mute state is changed.

Arguments:

> `Bool` mute - The new mute state.


## Seeked

Called whenever the time position changes by an unexpected amount, e.g.
at seek to a new time position.

Arguments:

> `Int` timePosition - The position that was seeked to in milliseconds.


## StreamTitleChanged

Called whenever the currently playing stream title changes.

Arguments:

> `String` title - The new stream title.
-}
type MopidyCoreEvent
    = MuteChanged Bool
    | OptionsChanged
    | PlaybackStateChanged PlaybackState PlaybackState
    | PlaylistChanged Playlist
    | PlaylistDeleted String
    | PlaylistsLoaded
    | Seeked Int
    | StreamTitleChanged String
    | TrackPlaybackEnded TlTrack Int
    | TrackPlaybackPaused TlTrack Int
    | TrackPlaybackResumed TlTrack Int
    | TrackPlaybackStarted TlTrack
    | TracklistChanged
    | VolumeChanged Int


{-| Decodes a mopidy event from the following list.

Use [the `Json.Decode` library](http://package.elm-lang.org/packages/elm-lang/core/latest/Json-Decode)
to decode event messages sent from Mopidy.

    import Json.Decode exposing (decodeString)

    decodeString
        mopidyEvent
        """
        {"old_state": "playing", "new_state": "paused", "event": "playback_state_changed"}
        """

Which should become

    PlaybackStateChanged PlaybackState.Playing PlaybackState.Paused

-}
mopidyEvent : Decoder MopidyCoreEvent
mopidyEvent =
    ("event" := string) `andThen` decodeMopidyEvent


{-| Selects the proper decoder for a Mopidy event from the
event string.
-}
decodeMopidyEvent : String -> Decoder MopidyCoreEvent
decodeMopidyEvent event =
    case event of
        "mute_changed" ->
            decode MuteChanged
                |> required "mute" bool

        "options_changed" ->
            decode OptionsChanged

        "playback_state_changed" ->
            decode PlaybackStateChanged
                |> required "old_state" (string `andThen` decodePlaybackState)
                |> required "new_state" (string `andThen` decodePlaybackState)

        "playlist_changed" ->
            decode PlaylistChanged
                |> required "playlist" playlist

        "playlist_deleted" ->
            decode PlaylistDeleted
                |> required "uri" string

        "playlists_loaded" ->
            decode PlaylistsLoaded

        "seeked" ->
            decode Seeked
                |> required "time_position" int

        "stream_title_changed" ->
            decode StreamTitleChanged
                |> required "title" string

        "track_playback_ended" ->
            decode TrackPlaybackEnded
                |> required "tl_track" tlTrack
                |> required "time_position" int

        "track_playback_paused" ->
            decode TrackPlaybackPaused
                |> required "tl_track" tlTrack
                |> required "time_position" int

        "track_playback_resumed" ->
            decode TrackPlaybackResumed
                |> required "tl_track" tlTrack
                |> required "time_position" int

        "track_playback_started" ->
            decode TrackPlaybackStarted
                |> required "tl_track" tlTrack

        "tracklist_changed" ->
            decode TracklistChanged

        "volume_changed" ->
            decode VolumeChanged
                |> required "volume" int

        _ ->
            fail (event ++ " is not a recognized event for Mopidy")
