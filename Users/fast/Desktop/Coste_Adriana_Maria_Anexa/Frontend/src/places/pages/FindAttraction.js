import React, { useEffect, useState } from "react";
import MapPlace from "../../shared/components/UIElements/MapPlace";
import "./FindAttraction.css";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import PlaceList from "../components/PlaceList";
import Select from "react-select";
import "../components/PlaceList.css";
import { Typography } from "@mui/material";

const FindAttractions = (props) => {
  const { coordinates, setCoordinates, reviews, setReviews } = props;
  const [bounds, setBounds] = useState(null);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedPlaces, setLoadedPlaces] = useState();
  const [loadedPosts, setLoadedPosts] = useState();
  const [filteredPlacesByType, setFilteredPlacesByType] = useState();
  const [filteredPlacesByBounds, setFilteredPlacesByBounds] =
    useState(loadedPlaces);
  const [childClicked, setChildClicked] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) => {
        setCoordinates({ lat: latitude, lng: longitude });
      }
    );
  }, []);

  useEffect(() => {}, [reviews]);

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const responsData = await sendRequest(
          `http://localhost:5000/api/places/?swLat=${bounds.sw.lat}&swLng=${bounds.sw.lng}&neLat=${bounds.ne.lat}&neLng=${bounds.ne.lng}`
        );
        setLoadedPlaces(responsData.places);
      } catch (err) {}
    };
    fetchPlaces();
  }, [sendRequest, bounds]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const responsData = await sendRequest(
          `http://localhost:5000/api/posts`
        );
        setLoadedPosts(responsData.posts);
      } catch (err) {}
    };
    fetchPosts();
  }, [sendRequest]);

  const types = [
    { value: "Restaurant", label: "Restaurants" },
    { value: "Hotel", label: "Hotels" },
    { value: "Attraction", label: "Attractions" },
  ];

  return (
    <div className="find-attraction-container">
      <div className="sidebar">
        <div>
          <Typography variant="h5" className="typography ">
            Restaurant, Hotels & Attractions around you
          </Typography>
          <Select
            options={types}
            onChange={(e) => {
              const filtered = loadedPlaces.filter((place) => {
                return place.type === e.value;
              });
              setFilteredPlacesByType(filtered);
            }}
          />
        </div>
        <ErrorModal error={error} onClear={clearError} />
        {isLoading && (
          <div className="center">
            <LoadingSpinner />
          </div>
        )}
        {!isLoading && loadedPlaces && (
          <div className="place-list-container">
            <PlaceList
              items={[
                filteredPlacesByType !== undefined
                  ? filteredPlacesByType
                  : loadedPlaces,
                loadedPosts,
              ]}
              reviews={reviews}
              setReviews={setReviews}
              childClicked={childClicked}
              {...{ setCoordinates }}
            />
          </div>
        )}
      </div>
      <div className="map-place-container">
        <MapPlace
          zoom={7}
          setCoordinates={setCoordinates}
          setBounds={setBounds}
          coordinates={coordinates}
          loadedPlaces={loadedPlaces}
          reviews={reviews}
          setChildClicked={setChildClicked}
        />
      </div>
    </div>
  );
};

export default FindAttractions;
