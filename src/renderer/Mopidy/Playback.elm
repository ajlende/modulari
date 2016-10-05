port module Mopidy.Playback
    exposing
        ( PlaybackMsg(..)
        , play
        , next
        , previous
        , stop
        , pause
        , resume
        , seek
        , seekResult
        , getCurrentTlTrack
        , currentTlTrack
        , getCurrentTrack
        , currentTrack
        , getStreamTitle
        , streamTitle
        , getTimePosition
        , timePosition
        , getState
        , state
        , setState
        )

{-| The Mopidy playback controller

[Mopidy Docs](https://docs.mopidy.com/en/latest/api/core/#playback-controller)

# Mopidy playback controller

## Playback control

@docs play, next, previous, stop, pause, resume, seek, seekResult

## Current track

@docs getCurrentTlTrack, currentTlTrack, getCurrentTrack, currentTrack
@docs getStreamTitle, streamTitle, getTimePosition, timePosition

## Playback state

@docs getState, state, setState
-}

import Mopidy.DataModels exposing (..)


-- Playback control


type PlaybackMsg
    = Play (Maybe Int)
    | Next
    | Previous
    | Stop
    | Pause
    | Resume
    | Seek Int


{-| Play the given track, or if the given track is Nothing, play the currently
active track. Note that the track *must* already me in the tracklist.

Arguments:

> tlid: Just TLID of the track to play or Nothing to play active track
-}
port play : Maybe Int -> Cmd msg


{-| Change to the next track.

The current playback state will be unaffected.
-}
port next : () -> Cmd msg


{-| Change to the previous track.

The current playback state will be unaffected.
-}
port previous : () -> Cmd msg


{-| Stop playing.
-}
port stop : () -> Cmd msg


{-| Pause playback.
-}
port pause : () -> Cmd msg


{-| If paused, resume playing the current track.
-}
port resume : () -> Cmd msg


{-| Seeks to the time position given in milliseconds.

[Mopidy Docs](https://docs.mopidy.com/en/latest/api/core/#mopidy.core.PlaybackController.seek)

Arguments:

> timePosition: Time position in milliseconds
-}
port seek : Int -> Cmd msg


{-| Result of seek. True if successful, else false.
-}
port seekResult : (Bool -> msg) -> Sub msg



-- Current track


{-| Get the currently playing or selected tracklist track.

[Mopidy Docs](https://docs.mopidy.com/en/latest/api/core/#mopidy.core.PlaybackController.get_current_tl_track)
-}
port getCurrentTlTrack : () -> Cmd msg


{-| Result of getCurrentTlTrack. Just TlTrack if present, else Nothing.
-}
port currentTlTrack : (Maybe TlTrack -> msg) -> Sub msg


{-| Get the currently playing or selected track.

[Mopidy Docs](https://docs.mopidy.com/en/latest/api/core/#mopidy.core.PlaybackController.get_current_track)
-}
port getCurrentTrack : () -> Cmd msg


{-| Result of getCurrentTrack. Just Track if present, else Nothing.
-}
port currentTrack : (Maybe Track -> msg) -> Sub msg


{-| Get the currently stream title.

[Mopidy Docs](https://docs.mopidy.com/en/latest/api/core/#mopidy.core.PlaybackController.get_stream_title)
-}
port getStreamTitle : () -> Cmd msg


{-| Result of getStreamTitle. Just String if present, else Nothing.
-}
port streamTitle : (Maybe String -> msg) -> Sub msg


{-| Get time position in milliseconds.

[Mopidy Docs](https://docs.mopidy.com/en/latest/api/core/#mopidy.core.PlaybackController.get_time_position)
-}
port getTimePosition : () -> Cmd msg


{-| Result of getTimePosition. Time position in milliseconds.
-}
port timePosition : (Int -> msg) -> Sub msg



-- Playback states


{-| Get the playback state.

[Mopidy Docs](https://docs.mopidy.com/en/latest/api/core/#mopidy.core.PlaybackController.get_state)
-}
port getState : () -> Cmd msg


{-| Result of getState. String to decode to PlaybackState.
-}
port state : (String -> msg) -> Sub msg


{-| Set the playback state. String of encoded PlaybackState.

[Mopidy Docs](https://docs.mopidy.com/en/latest/api/core/#mopidy.core.PlaybackController.set_state)

Arguments:

> newState: New playback state
-}
port setState : String -> Cmd msg
