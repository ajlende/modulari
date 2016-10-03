module Natural exposing (..)


type Natural
    = Natural Int


fromInt : Int -> Maybe Natural
fromInt x =
    if x >= 0 then
        Just (Natural x)
    else
        Nothing


toInt : Natural -> Int
toInt (Natural x) =
    x
