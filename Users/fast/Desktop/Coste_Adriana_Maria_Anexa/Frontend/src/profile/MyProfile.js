import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { formHook, useForm } from "../../src/shared/hooks/form-hook";
import PostList from "../posts/components/PostList";
import Modal from "../shared/components/UIElements/Modal";
import Card from "../shared/components/UIElements/Card";
import { AuthContext } from "../../src/shared/context/auth-context";
import Button from "../shared/components/FormElements/Button";
import ImageUpload from "../../src/shared/components/FormElements/ImageUpload";
import Select from "react-select";
import InputSelect from "../shared/components/FormElements/InputSelect";
import LoadingSpinner from "../shared/components/UIElements/LoadingSpinner";
import Input from "../shared/components/FormElements/Input";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../src/shared/util/validators.js";
import { useHttpClient } from "../../src/shared/hooks/http-hook";
import { Avatar } from "@mui/material";
import InputMUI from "@mui/material/Input";
import "./MyProfile.css";

const MyProfile = (props) => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedPlaces, setLoadedPlaces] = useState(false);
  const [titleSelectOptions, setTitleSelectOptions] = useState();
  const [filteredPlacesByTitle, setFilteredPlacesByTitle] = useState();
  const [formvalidator, setFormValidator] = useState(false);
  const [loadedPosts, setLoadedPosts] = useState([]);
  const [showAddPost, setShowAddPost] = useState(false);
  const [loadedUser, setLoadedUser] = useState();
  const [loadedUserImage, setLoadedUserImage] = useState();
  console.log(auth.userId);
  console.log();

  const opanAddPosHandler = () => {
    setShowAddPost(true);
  };
  const closeAddPosHandler = () => {
    setShowAddPost(false);
  };

  const [formState, inputHandler] = useForm(
    {
      comment: {
        value: "",
        isValid: false,
      },
      review: {
        value: "",
        isValid: false,
      },
      recommend: {
        value: "",
        isValid: false,
      },
      image: {
        value: null,
        isValid: false,
      },
    },
    false
  );

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const responsData = await sendRequest(
          "http://localhost:5000/api/places"
        );
        setLoadedPlaces(responsData.places);
        const selectOptions = responsData.places.map((place) => {
          return { value: place._id, label: place.title };
        });
        setTitleSelectOptions(selectOptions);
      } catch (err) {}
    };
    fetchPlaces();
  }, [sendRequest]);
  console.log(loadedPlaces);

  const postDeletedHandler = (deletedPostId) => {
    setLoadedPosts((prevPost) =>
      prevPost.filter((post) => post._id !== deletedPostId)
    );
    // am setat setLoadedPlaces la un array in care locul pe care il sterg nu este
  };

  const userId = useParams().uid;
  console.log(userId);
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/posts/user/${userId}`
        );

        setLoadedPosts(responseData.posts);
      } catch (err) {}
    };
    fetchPosts();
  }, [sendRequest, userId]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const responsData = await sendRequest(
          `http://localhost:5000/api/users/${userId}`
        );
        setLoadedUser(responsData.user);
        setLoadedUserImage(responsData.user.image);
      } catch (err) {}
    };
    fetchUsers();
  }, []);

  const postSubmitHandler = async (event) => {
    event.preventDefault(); // to prevent the browser to submit the form and reloud the page

    try {
      const formData = new FormData();
      formData.append("title", filteredPlacesByTitle.label);
      formData.append("comment", formState.inputs.comment.value);
      formData.append("review", formState.inputs.review.value);
      formData.append("recommend", formState.inputs.recommend.value);
      formData.append("placeId", filteredPlacesByTitle.value);
      formData.append("image", formState.inputs.image.value);
      await sendRequest(
        "http://localhost:5000/api/posts/new",
        "POST",
        formData,
        {
          Authorization: "Bearer " + auth.token,
        }
      );
    } catch (err) {}
  };

  const review = [
    { value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "3", label: "3" },
    { value: "4", label: "4" },
    { value: "5", label: "5" },
  ];

  const recommend = [
    { value: "true", label: "Recommend" },
    { value: "false", label: "Not recommend" },
  ];

  return (
    <React.Fragment>
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedUser && (
        <div>
          <div className="profile-main-container">
            <Card className="profile-main-card">
              <div className="profile-header-container">
                <div className="cover-image-container">
                  <img
                    src="https://images.unsplash.com/photo-1496950866446-3253e1470e8e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTR8fHRyYXZlbCUyMGhhZGVyJTIwZm9yJTIwd2lkZSUyMGFuZCUyMG5hcnJvd3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60"
                    alt="Cover image"
                    className="cover-image"
                  />
                </div>
                <div className="profile-picture-container">
                  <img
                    src={`http://localhost:5000/${loadedUser.image}`}
                    alt="Profile picture"
                    className="profile-picture"
                  />
                </div>
                <div className="profile-details-container">
                  <h1 className="profile-name">
                    {`${loadedUser.lastname}`}&nbsp;
                    {`${loadedUser.firstname}`}
                  </h1>
                </div>
              </div>
            </Card>
          </div>

          <div className="profile-main-container">
            <div className="div-right-side">
              {auth.userId === userId && (
                <Card className="card-share-post">
                  <div className="div-share-post">
                    <Avatar
                      className="avatar-share-post"
                      sx={{ width: 50, height: 50 }}
                      src={`http://localhost:5000/${loadedUser.image}`}
                    />
                    <InputMUI
                      onClick={opanAddPosHandler}
                      className="input-share-post"
                      placeholder="  Add a location you've been to ..."
                    />
                  </div>
                </Card>
              )}

              <PostList
                items={[loadedPosts, loadedPlaces, loadedUser]}
                onDeletePlace={postDeletedHandler}
              />
            </div>
          </div>
        </div>
      )}
      <Modal
        onSubmit={postSubmitHandler}
        show={showAddPost}
        onCancel={closeAddPosHandler}
        header="Add Post"
      >
        <div className="form-control">
          <label className="label">Title</label>
          <Select
            options={titleSelectOptions}
            onChange={(e) => {
              console.log(e);
              setFormValidator(true);
              setFilteredPlacesByTitle(e);
            }}
          />
        </div>
        <Input
          id="comment"
          element="textarea"
          label="Comment"
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText="Please enter a valid comment (at least 5 characters)."
          onInput={inputHandler}
        />
        <InputSelect
          id="review"
          element="input"
          type="text"
          options={review}
          label="Review"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid review."
          onInput={inputHandler}
        />
        <InputSelect
          id="recommend"
          element="input"
          type="text"
          options={recommend}
          label="Recommend"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid recommendation."
          onInput={inputHandler}
        />

        <ImageUpload
          id="image"
          onInput={inputHandler}
          errorText="Please upload an image"
        />
        <Button
          type="submit"
          style={{ align: "center" }}
          disabled={!formState.isValid || !formvalidator}
          onClick={closeAddPosHandler}
        >
          ADD POST
        </Button>
      </Modal>
    </React.Fragment>
  );
};

export default MyProfile;
