import React, { useEffect, useState } from "react";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import PlaceList from "../components/PlaceList";

const AllPlaces = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedPlaces, setLoadedPlaces] = useState();

  const DUMMY_PLACES = [
    {
      id: "p1",
      title: "1",
      description: "!!!!",
      imageUrl:
        "https://www.google.com/imgres?imgurl=https%3A%2F%2Fcdn.pixabay.com%2Fphoto%2F2015%2F04%2F23%2F22%2F00%2Ftree-736885__480.jpg&tbnid=9SPhZ2nyEGps3M&vet=12ahUKEwie-crp27H-AhVji_0HHQnrB4AQMygFegUIARCaAQ..i&imgrefurl=https%3A%2F%2Fpixabay.com%2Fimages%2Fsearch%2Fnature%2F&docid=Ba_eiczVaD9-zM&w=771&h=480&itg=1&q=image&ved=2ahUKEwie-crp27H-AhVji_0HHQnrB4AQMygFegUIARCaAQ",
      address: "acolo",
      location: {
        lat: 11,
        lng: 11,
      },
    },
  ];

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const responsData = await sendRequest(
          "http://localhost:5000/api/places"
        );
        setLoadedPlaces(responsData.places);
      } catch (err) {}
    };
    fetchPlaces();
  }, [sendRequest]);
  console.log(loadedPlaces);

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedPlaces && <PlaceList items={loadedPlaces} />}
    </React.Fragment>
  );
};

export default AllPlaces;
