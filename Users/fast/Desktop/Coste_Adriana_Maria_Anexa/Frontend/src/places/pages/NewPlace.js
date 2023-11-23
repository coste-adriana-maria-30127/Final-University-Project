import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
  VALIDATOR_PRICE,
} from "../../shared/util/validators.js";
import { useForm } from "../../shared/hooks//form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import "./PlaceForm.css";

//functia este folosite ca sa nu te lase sa treci de form numai daca toate inputurile sunt corecte
//o sa actiualizeze starile doar de la inputurile care se schimba

const NewPlace = () => {
  const auth = useContext(AuthContext);
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
    },
    false
  );

  const history = useNavigate();

  const placeSubmitHandler = async (event) => {
    event.preventDefault(); // to prevent the browser to submit the form and reloud the page

    // console.log(formState.inputs.phone);
    try {
      const formData = new FormData();
      formData.append("title", formState.inputs.title.value);
      formData.append("description", formState.inputs.description.value);
      formData.append("image", formState.inputs.image.value);
      formData.append("address", formState.inputs.address.value);
      formData.append("price", formState.inputs.price.value);
      formData.append("phone", formState.inputs.phone.value);

      await sendRequest("http://localhost:5000/api/places", "POST", formData, {
        Authorization: "Bearer " + auth.token,
      });
      history("/");
      //Redirect the user to a diferente page
    } catch (err) {}
  };

  return (
    <React.Fragment>
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
        <Input
          id="price"
          element="input"
          type="text"
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
          errorText="Please enter a valid price."
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
    </React.Fragment>
  );
};

export default NewPlace;
