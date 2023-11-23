import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../shared/context/auth-context";
import PlaceList from "../components/PlaceList";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";

const UserPlaces = () => {
  const auth = useContext(AuthContext);
  const [loadedPlaces, setLoadedPlaces] = useState([]);
  const [deleted, setDeleted] = useState(false);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  // const userId = auth.userId; // returneaza un obiect care stocheaza doar partea dinamica a url ului
  const userId = useParams().uid;

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/places/user/${userId}`
        );
        setLoadedPlaces(responseData.places);
      } catch (err) {}
    };
    fetchPlaces();
  }, [sendRequest, userId]);

  const placeDeletedHandler = (deletedPlaceId) => {
    // setDeleted(!deleted);

    setLoadedPlaces((prevPlaces) =>
      prevPlaces.filter((place) => place.id !== deletedPlaceId)
    );
    // am setat setLoadedPlaces la un array in care locul pe care il sterg nu este
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedPlaces && (
        <PlaceList items={loadedPlaces} onDelete={placeDeletedHandler} />
      )}
      ;
    </React.Fragment>
  );
};

export default UserPlaces;
