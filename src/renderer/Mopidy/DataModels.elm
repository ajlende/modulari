module Mopidy.DataModels exposing (..)

{-| Data Models from Mopidy
https://docs.mopidy.com/en/latest/api/models/
-}

import Json.Decode exposing (..)
import Json.Decode.Pipeline exposing (..)

type RefType
  = AlbumRef
  | ArtistRef
  | DirectoryRef
  | PlaylistRef
  | TrackRef
  | Unknown

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
      Unknown

decodeRefType : String -> Decoder RefType
decodeRefType str = decode (refType str)


type alias Ref =
  { uri : String
  , name : String
  , refType : RefType
  }

ref : Decoder Ref
ref =
  decode Ref
    |> required "uri" string
    |> required "name" string
    |> required "refType" (string `andThen` decodeRefType)


type alias Track =
  { uri : String
  , name : String
  , artists : Maybe (List Artist)
  , album : Maybe Album
  , composers : Maybe String
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

track : Decoder Track
track =
  decode Track
    |> required "uri" string
    |> required "name" string
    |> required "artists" (nullable (list artist))
    |> required "album" (nullable album)
    |> required "composers" (nullable string)
    |> required "performers" (nullable string)
    |> required "genre" (nullable string)
    |> required "trackNum" (nullable int)
    |> required "discNum" (nullable int)
    |> required "date" (nullable string)
    |> required "duration" (nullable int)
    |> required "bitrate" (nullable int)
    |> required "comment" (nullable string)
    |> required "musicbrainzID" (nullable string)
    |> required "lastModified" (nullable int)


type alias Album =
  { uri : String
  , name : String
  , artists : List Artist
  , numTracks : Maybe Int
  , numDiscs : Maybe Int
  , date : String
  , musicbrainzID : String
  , images : List String
  }

album : Decoder Album
album =
  decode Album
    |> required "uri" string
    |> required "name" string
    |> required "artists" (list artist)
    |> required "numTracks" (nullable int)
    |> required "numDiscs" (nullable int)
    |> required "date" string
    |> required "musicbrainzID" string
    |> required "images" (list string)


type alias Artist =
  { uri : String
  , name : String
  , sortName : String
  , musicbrainzID : String
  }

artist : Decoder Artist
artist =
  decode Artist
    |> required "uri" string
    |> required "name" string
    |> required "sortName" string
    |> required "musicbrainzID" string


type alias Playlist =
  { uri : String
  , name : String
  , tracks : List Track
  , lastModified : Maybe Int
  }

playlist : Decoder Playlist
playlist =
  decode Playlist
    |> required "uri" string
    |> required "name" string
    |> required "tracks" (list track)
    |> required "lastModified" (nullable int)



type alias Image =
  { uri : String
  , width : Maybe Int
  , height : Maybe Int
  }

image : Decoder Image
image =
  decode Image
    |> required "uri" string
    |> required "width" (nullable int)
    |> required "height" (nullable int)


type alias TlTrack =
  { tlid : Int
  , track : Track
  }

tlTrack : Decoder TlTrack
tlTrack =
  decode TlTrack
    |> required "tlid" int
    |> required "track" track


type alias SearchResult =
  { uri : String
  , tracks : List Track
  , artists : List Artist
  , albums : List Album
  }

searchResult : Decoder SearchResult
searchResult =
  decode SearchResult
    |> required "uri" string
    |> required "tracks" (list track)
    |> required "artists" (list artist)
    |> required "albums" (list album)
