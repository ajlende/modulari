port module Mopidy.Tracklist exposing (..)

import Mopidy.DataModels exposing (..)


{-| Add tracks to the tracklist and triggers the
Mopidy.CoreEvents.MopidyEvent.TracklistChanged event.

[Mopidy Docs](https://docs.mopidy.com/en/latest/api/core/#mopidy.core.TracklistController.add)

Arguments:

> uris: The URIs of tracks to add
>
> toPosition: The position at which to add the tracks
-}
port add : ( List String, Int ) -> Cmd msg


{-| Result of addTracks. The tracks that were added.
-}
port addResult : (List TlTrack -> msg) -> Sub msg


{-| Remove the matching tracks from the tracklist and triggers the
Mopidy.CoreEvents.MopidyEvent.TracklistChanged event.

[Mopidy Docs](https://docs.mopidy.com/en/latest/api/core/#mopidy.core.TracklistController.remove)

Arguments:

> criteria: Record of criteria to match by as a JSON encoded string
-}
port remove : String -> Cmd msg


{-| Result of removeTracks. The tracks that were removed.
-}
port removeResult : (List TlTrack -> msg) -> Sub msg


{-| Clears the tracklist and triggers the
Mopidy.CoreEvents.MopidyEvent.TracklistChanged event.

[Mopidy Docs](https://docs.mopidy.com/en/latest/api/core/#mopidy.core.TracklistController.clear)
-}
port clear : () -> Cmd msg


{-| Moves the tracks in the slice [start:end] to position and triggers the
Mopidy.CoreEvents.MopidyEvent.TracklistChanged event.

[Mopidy Docs](https://docs.mopidy.com/en/latest/api/core/#mopidy.core.TracklistController.move)

Arguments:

> start: Position of the first track to move
>
> end: Position of the last track to move
>
> toPosition: New position for the tracks
-}
port move : ( Int, Int, Int ) -> Cmd msg


{-| Shuffles the entire tracklist. If start and end is given, only shuffles the
slice [start:end]. Also triggers the
Mopidy.CoreEvents.MopidyEvent.TracklistChanged event.

[Mopidy Docs](https://docs.mopidy.com/en/latest/api/core/#mopidy.core.TracklistController.shuffle)

Arguments:

> start: Position of the first track to shuffle
>
> end: Position of the last track to shuffle
-}
port shuffle : ( Maybe Int, Maybe Int ) -> Cmd msg
