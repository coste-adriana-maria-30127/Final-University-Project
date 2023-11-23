import React, { useContext, useEffect, useState } from "react";
import Card from "../../shared/components/UIElements/Card";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators.js";
import { AuthContext } from "../../shared/context/auth-context";
import { useForm } from "../../shared/hooks/form-hook";
import "./Register.css";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { Checkbox } from "@mui/material";

const Register = () => {
  const register = useContext(AuthContext);
  const [isAdmin, setIsAdmin] = useState(false);

  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  useEffect(() => {
    // console.log(isAdmin);
  }, [isAdmin]);

  const [formState, inputHandler] = useForm(
    {
      firstname: {
        value: "",
        isValid: false,
      },
      lastname: {
        value: "",
        isValid: false,
      },
      image: {
        value: null,
        isValid: false,
      },
      email: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const registerSubmitHandler = async (event) => {
    event.preventDefault(); // to prevent the browser to submit the form and reloud the page

    try {
      const formData = new FormData();
      formData.append("email", formState.inputs.email.value);
      formData.append("firstname", formState.inputs.firstname.value);
      formData.append("lastname", formState.inputs.lastname.value);
      formData.append("password", formState.inputs.password.value);
      formData.append("image", formState.inputs.image.value);
      formData.append("role", isAdmin ? "Admin" : "User");

      const responseData = await sendRequest(
        "http://localhost:5000/api/users/signup",
        "POST",
        formData
      );
      register.login(
        responseData.userId,
        responseData.token,
        responseData.role
      );
    } catch (err) {}
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Card className="register">
        {isLoading && <LoadingSpinner asOverly />}
        <h2>Register Required</h2>
        <hr />
        <form onSubmit={registerSubmitHandler} className="form-allign">
          <Input
            id="firstname"
            element="input"
            type="text"
            label="First Name"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid first name"
            onInput={inputHandler}
          />
          <Input
            id="lastname"
            element="input"
            type="text"
            label="Last Name"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid last name"
            onInput={inputHandler}
          />
          <ImageUpload
            center="center"
            id="image"
            onInput={inputHandler}
            errorText="Please upload an image"
          />
          <Input
            id="email"
            element="input"
            type="email"
            label="E-Mail"
            validators={[VALIDATOR_EMAIL()]}
            errorText="Please enter a valid email address"
            onInput={inputHandler}
          />
          <Input
            id="password"
            element="input"
            type="password"
            label="Password"
            validators={[VALIDATOR_MINLENGTH(6)]}
            errorText="Please enter a valid password"
            onInput={inputHandler}
          />
          <div style={{ display: "flex", justifyContent: "center" }}>
            <p>User is Admin</p>
            <Checkbox
              element="checkbox"
              checked={isAdmin}
              onChange={(e) => setIsAdmin(e.target.checked)}
            />
          </div>
          <Button type="submit" disabled={!formState.isValid}>
            SIGNUP
          </Button>
        </form>
        <Button to="/auth">SWITCH TO AUTHENTICATION</Button>
      </Card>
    </React.Fragment>
  );
};

export default Register;
