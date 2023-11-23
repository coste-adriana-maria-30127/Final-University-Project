import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../shared/context/auth-context";
import Input from "../../shared/components/FormElements/Input";
import InputSelect from "../../shared/components/FormElements/InputSelect";
import Button from "../../shared/components/FormElements/Button";
import Card from "../../shared/components/UIElements/Card";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_PRICE,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators.js";
import PlaceList from "../components/PlaceList";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { useForm } from "../../shared/hooks//form-hook";

import "./PlaceForm.css";
import "../components/PlaceList.css";
import "./styles.css";

const PlacesAdministration = ({ reviews, setReviews, setCoordinates }) => {
  const auth = useContext(AuthContext);
  const [loadedPlaces, setLoadedPlaces] = useState(false);
  const [loadedPosts, setLoadedPosts] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [formState, inputHandler] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      image: {
        value: null,
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
      address: {
        value: "",
        isValid: false,
      },
      price: {
        value: "",
        isValid: false,
      },
      phone: {
        value: "",
        isValid: false,
      },
      type: {
        value: "",
        isValid: false,
      },
      food: {
        value: "",
        isValid: false,
      },
      site: {
        value: "",
        isValid: false,
      },
    },
    false
  );
  // console.log(formState.inputs);

  const history = useNavigate();

  const placeSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      const formData = new FormData();
      formData.append("title", formState.inputs.title.value);
      formData.append("description", formState.inputs.description.value);
      formData.append("image", formState.inputs.image.value);
      formData.append("address", formState.inputs.address.value);
      formData.append("price", formState.inputs.price.value);
      formData.append("phone", formState.inputs.phone.value);
      formData.append("type", formState.inputs.type.value);
      formData.append("food", formState.inputs.food.value);
      formData.append("site", formState.inputs.site.value);

      await sendRequest("http://localhost:5000/api/places", "POST", formData, {
        Authorization: "Bearer " + auth.token,
      });
      history("/");
    } catch (err) {}
  };

  // const userId = auth.userId; // returneaza un obiect care stocheaza doar partea dinamica a url ului
  const userId = useParams().uid;
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
  console.log(loadedPosts);

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
  }, [sendRequest, userId, deleted]);

  const placeDeletedHandler = (deletedPlaceId) => {
    setDeleted(!deleted);
    setLoadedPlaces((prevPlaces) =>
      prevPlaces.filter((place) => place.id !== deletedPlaceId)
    ); // am setat setLoadedPlaces la un array in care locul pe care il sterg nu este
  };

  const price = [
    { value: "$", label: "$" },
    { value: "$-$$", label: "$-$$" },
    { value: "$$", label: "$$" },
    { value: "$$-$$$", label: "$$-$$$" },
    { value: "$$$", label: "$$$" },
  ];
  const type = [
    { value: "Restaurant", label: "Restaurant" },
    { value: "Hotel", label: "Hotel" },
    { value: "Attraction", label: "Attraction" },
  ];

  return (
    <React.Fragment>
      <div className="place-administration-container">
        <div className="left-column">
          <ErrorModal error={error} onClear={clearError} />
          <form className="place-form" onSubmit={placeSubmitHandler}>
            {isLoading && <LoadingSpinner asOverlay />}
            <Input
              id="title"
              element="input"
              type="text"
              label="Title"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Please enter a valid title."
              onInput={inputHandler}
            />
            <ImageUpload
              id="image"
              onInput={inputHandler}
              errorText="Please upload an image"
            />
            <Input
              id="description"
              element="textarea"
              label="Description"
              validators={[VALIDATOR_MINLENGTH(5)]}
              errorText="Please enter a valid description (at least 5 characters)."
              onInput={inputHandler}
            />
            <Input
              id="address"
              element="input"
              type="text"
              label="Address"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Please enter a valid address."
              onInput={inputHandler}
            />
            <InputSelect
              id="price"
              element="input"
              type="text"
              options={price}
              label="Price"
              validators={[VALIDATOR_PRICE()]}
              errorText="Please enter a valid price."
              onInput={inputHandler}
            />
            <Input
              id="phone"
              element="input"
              type="text"
              label="Phone"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Please enter a valid phone."
              onInput={inputHandler}
            />
            <InputSelect
              id="type"
              element="input"
              type="text"
              options={type}
              label="Type"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Please enter a valid type."
              onInput={inputHandler}
            />
            <Input
              id="food"
              element="input"
              type="text"
              label="Food"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Please enter a valid food."
              onInput={inputHandler}
            />
            <Input
              id="site"
              element="input"
              type="text"
              label="Site"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Please enter a valid site."
              onInput={inputHandler}
            />
            <Button
              type="submit"
              style={{ align: "center" }}
              disabled={!formState.isValid}
            >
              ADD PLACE
            </Button>
          </form>
        </div>
        <div className="right-column">
          <ErrorModal error={error} onClear={clearError} />
          {isLoading && (
            <div className="center">
              <LoadingSpinner />
            </div>
          )}
          {!isLoading && loadedPosts && (
            <>
              {loadedPlaces && loadedPlaces.length > 0 ? (
                <div className="place-list-container">
                  <PlaceList
                    items={[loadedPlaces, loadedPosts]}
                    onDeletePlace={placeDeletedHandler}
                    reviews={reviews}
                    setReviews={setReviews}
                    {...{ setCoordinates }}
                  />
                </div>
              ) : (
                <div className="place-list center">
                  <Card>
                    <h2>No places found. Maybe create one?</h2>
                  </Card>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </React.Fragment>
  );
};

export default PlacesAdministration;
