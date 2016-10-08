module Mopidy.DataModels
    exposing
        ( PlaybackState(..)
        , RefType(..)
        , Ref
        , Track
        , Album
        , Artist
        , Playlist
        , TlTrack
        , SearchResult
        , decodePlaybackState
        , decodeRefType
        , ref
        , track
        , album
        , artist
        , playlist
        , tlTrack
        , searchResult
        )

{-| These data models are used for representing Mopidy data received from the
Mopidy backend. Many fields are optional, so they will require handling of
default values where they are used.

# Mopidy data models

[Mopidy Docs](https://docs.mopidy.com/en/latest/api/models/)

@docs PlaybackState, RefType, Ref, Track, Album, Artist, Playlist, TlTrack, SearchResult

## Decoding from JSON

Mopidy sends information as JSON through a websocket which needs to be
translated into Elm types.

For each of the types below, use
[the `Json.Decode` library](http://package.elm-lang.org/packages/elm-lang/core/latest/Json-Decode).

    import Json.Decode exposing (decodeString)

    decodeString
        artist
        """
        { "name": "Coldplay", "musicbrainzID": "cc197bad-dc9c-440d-a5b5-d52ba2e14234" }
        """

Which should become

    { uri : Nothing
    , name : "Coldplay"
    , sortName : Nothing
    , musicbrainzID : "cc197bad-dc9c-440d-a5b5-d52ba2e14234"
    }

@docs ref, track, album, artist, playlist, tlTrack, searchResult

### Helper Decoders

@docs decodePlaybackState, decodeRefType

## Encoding to Json

    -- TODO
-}

import Json.Decode exposing (..)
import Json.Decode.Pipeline exposing (..)


{-| A union type of all possible states that playback can be in.

One of `Stopped`, `Playing`, `Paused`, or `UnknownState`.
-}
type PlaybackState
    = Stopped
    | Playing
    | Paused
    | UnknownState


{-| (Private) Converts a string to a PlaybackState
-}
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
            UnknownState


{-| Converts a String to a Decoder for PlaybackState
-}
decodePlaybackState : String -> Decoder PlaybackState
decodePlaybackState str =
    decode (playbackState str)


{-| Union type for different URI reference types. Used within a Ref.

One of `AlbumRef`, `ArtistRef`, `DirectoryRef`, `PlaylistRef`, `TrackRef`, or
`UnknownRef`
-}
type RefType
    = AlbumRef
    | ArtistRef
    | DirectoryRef
    | PlaylistRef
    | TrackRef
    | UnknownRef


{-| (Private) Converts a string to a RefType.
-}
refType : String -> RefType
refType str =
    case str of
        "album" ->
            AlbumRef

        "artist" ->
            ArtistRef

        "directory" ->
            DirectoryRef

        "playlist" ->
            PlaylistRef

        "track" ->
            TrackRef

        _ ->
            UnknownRef


{-| Decodes a string into a RefType.
-}
decodeRefType : String -> Decoder RefType
decodeRefType str =
    decode (refType str)


{-| Model to represent URI references with a human friendly name and type
attached. This is intended for use a lightweight object "free" of metadata
that can be passed around instead of using full blown models.

[Mopidy Docs](https://docs.mopidy.com/en/latest/api/models/#mopidy.models.Ref)

> uri - The object URI.
>
> name - The object name.
>
> refType - The object type
-}
type alias Ref =
    { uri : String
    , name : String
    , refType : RefType
    }


{-| Decodes the JSON for a Ref.
-}
ref : Decoder Ref
ref =
    decode Ref
        |> required "uri" string
        |> required "name" string
        |> required "refType" (string `andThen` decodeRefType)


{-| Type model for a Mopidy track.

[Mopidy Docs](https://docs.mopidy.com/en/latest/api/models/#mopidy.models.Track)

> uri - The track URI.
>
> name - The track name.
>
> artists - A set of track artists.
>
> album - The track Album.
>
> composers - A set of track composers.
>
> performers - A set of track performers.
>
> genre - The track genre.
>
> trackNo - The track number in the album.
>
> diskNo - The disc number in the album.
>
> date - The track release date.
>
> duration - The track length in milliseconds.
>
> bitrate - The track's bitrate in kbit/s.
>
> comment - The track comment.
>
> musicbrainzId - The MusicBrainz ID of the track.
>
> lastModified - Integer representing when the track was last modified.
>     Exact meaning depends on source of track. For local files this is the
>     modification time in milliseconds since Unix epoch. For other backends it
>     could be an equivalent timestamp or simply a version counter.
-}
type alias Track =
    { uri : String
    , name : String
    , artists : List Artist
    , album : Album
    , composers : Maybe (List Artist)
    , performers : Maybe String
    , genre : Maybe String
    , trackNum : Maybe Int
    , discNum : Maybe Int
    , date : Maybe String
    , duration : Maybe Int
    , bitrate : Maybe Int
    , comment : Maybe String
    , musicbrainzID : Maybe String
    , lastModified : Maybe Int
    }


{-| Decodes the JSON data for a Track.
-}
track : Decoder Track
track =
    decode Track
        |> required "uri" string
        |> required "name" string
        |> optional "artists" (list artist) [ unknownArtist ]
        |> optional "album" album unknownAlbum
        |> optional "composers" (nullable (list artist)) Nothing
        |> optional "performers" (nullable string) Nothing
        |> optional "genre" (nullable string) Nothing
        |> optional "trackNum" (nullable int) Nothing
        |> optional "discNum" (nullable int) Nothing
        |> optional "date" (nullable string) Nothing
        |> optional "duration" (nullable int) Nothing
        |> optional "bitrate" (nullable int) Nothing
        |> optional "comment" (nullable string) Nothing
        |> optional "musicbrainzID" (nullable string) Nothing
        |> optional "lastModified" (nullable int) Nothing


{-| Type model for Mopidy Album.

[Mopidy Docs](https://docs.mopidy.com/en/latest/api/models/#mopidy.models.Album)

> uri - The album URI.
>
> name - The album name.
>
> artists - A set of album artists.
>
> numTracks - The number of tracks in the album.
>
> numDiscs - The number of discs in the album.
>
> date - The album release date.
>
> musicbrainzId - The MusicBrainz ID of the album.
-}
type alias Album =
    { uri : String
    , name : String
    , artists : List Artist
    , numTracks : Maybe Int
    , numDiscs : Maybe Int
    , date : Maybe String
    , musicbrainzID : Maybe String
    , images : Maybe (List String)
    }


unknownAlbum : Album
unknownAlbum =
    { uri = ""
    , name = "Unknown Album"
    , artists = [ unknownArtist ]
    , numTracks = Nothing
    , numDiscs = Nothing
    , date = Nothing
    , musicbrainzID = Nothing
    , images = Nothing
    }


{-| Decodes the JSON data for an Album.
-}
album : Decoder Album
album =
    decode Album
        |> optional "uri" string ""
        |> optional "name" string "Unknown Album"
        |> optional "artists" (list artist) [ unknownArtist ]
        |> optional "numTracks" (nullable int) Nothing
        |> optional "numDiscs" (nullable int) Nothing
        |> optional "date" (nullable string) Nothing
        |> optional "musicbrainz_id" (nullable string) Nothing
        |> optional "images" (nullable (list string)) Nothing


{-| Type model for Mopidy Artist.

[Mopidy Docs](https://docs.mopidy.com/en/latest/api/models/#mopidy.models.Artist)

> uri - The artist URI.
>
> name - The artist name.
>
> sortName - Artist name for better sorting, e.g. with articles stripped
>
> musicBrainzId - The MusicBrainz ID of the artist.
-}
type alias Artist =
    { uri : Maybe String
    , name : String
    , sortName : Maybe String
    , musicbrainzID : Maybe String
    }


unknownArtist : Artist
unknownArtist =
    { uri = Nothing
    , name = "Unknown Artist"
    , sortName = Nothing
    , musicbrainzID = Nothing
    }


{-| Decodes the JSON data for an Artist.
-}
artist : Decoder Artist
artist =
    decode Artist
        |> optional "uri" (nullable string) Nothing
        |> optional "name" string "Unknown Artist"
        |> optional "sortName" (nullable string) Nothing
        |> optional "musicbrainzID" (nullable string) Nothing


{-| Type model for Mopidy Playlist.

[Mopidy Docs](https://docs.mopidy.com/en/latest/api/models/#mopidy.models.Playlist)

> uri - The playlist URI.
>
> name - The playlist name.
>
> tracks - The playlist's tracks.
>
> lastModified - The playlist modification time in milliseconds since Unix epoch.
-}
type alias Playlist =
    { uri : String
    , name : String
    , tracks : List Track
    , lastModified : Maybe Int
    }


{-| Decodes the JSON data for a Playlist.
-}
playlist : Decoder Playlist
playlist =
    decode Playlist
        |> required "uri" string
        |> required "name" string
        |> required "tracks" (list track)
        |> optional "lastModified" (nullable int) Nothing


{-| Type model for Mopidy Image.

[Mopidy Docs](https://docs.mopidy.com/en/latest/api/models/#mopidy.models.Image)

> uri - The image URI.
>
> width - Optional width of the image.
>
> height - Optional height of the image.
-}
type alias Image =
    { uri : String
    , width : Maybe Int
    , height : Maybe Int
    }


{-| Decodes the JSON data for an Image.
-}
image : Decoder Image
image =
    decode Image
        |> required "uri" string
        |> optional "width" (nullable int) Nothing
        |> optional "height" (nullable int) Nothing


{-| Type model for Mopidy tracklist track. Wraps a regular track and its
tracklist ID.

The use of TlTrack allows the same track to appear multiple times in
the tracklist.

[Mopidy Docs](https://docs.mopidy.com/en/latest/api/models/#mopidy.models.TlTrack)

> tlid - The tracklist ID.
>
> track - The track.
-}
type alias TlTrack =
    { tlid : Int
    , track : Track
    }


{-| Decodes the JSON data for a TlTrack.
-}
tlTrack : Decoder TlTrack
tlTrack =
    decode TlTrack
        |> required "tlid" int
        |> required "track" track


{-| Type model for Mopidy SearchResult.

[Mopidy Docs](https://docs.mopidy.com/en/latest/api/models/#mopidy.models.SearchResult)

> uri - The search result URI.
>
> tracks - The tracks matching the search query.
>
> artists - The artists matching the search query.
>
> albums - The albums matching the search query.
-}
type alias SearchResult =
    { uri : String
    , tracks : List Track
    , artists : List Artist
    , albums : List Album
    }


{-| Decodes the JSON data for a SearchResult.
-}
searchResult : Decoder SearchResult
searchResult =
    decode SearchResult
        |> required "uri" string
        |> required "tracks" (list track)
        |> required "artists" (list artist)
        |> required "albums" (list album)
