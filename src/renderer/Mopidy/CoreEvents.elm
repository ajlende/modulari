module Mopidy.CoreEvents exposing (..)

import Json.Decode exposing (..)
import Json.Decode.Pipeline exposing (..)

import Mopidy.DataModels exposing (..)

type PlaybackState
  = Stopped
  | Playing
  | Paused
  | Unknown

playbackState : String -> PlaybackState
playbackState state =
  case state of
    "STOPPED" ->
      Stopped

    "PLAYING" ->
      Playing

    "PAUSED" ->
      Paused

    _ ->
      Unknown

decodePlaybackState : String -> Decoder PlaybackState
decodePlaybackState str = decode (playbackState str)

type MopidyEvent
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

mopidyEvent : Decoder MopidyEvent
mopidyEvent =
    ("event" := string) `andThen` decodeMopidyEvent

decodeMopidyEvent : String -> Decoder MopidyEvent
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
