import React, { useEffect, useState, useContext } from "react";
import { useForm } from "../shared/hooks/form-hook";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../shared/context/auth-context";
import { useHttpClient } from "../shared/hooks/http-hook";
import InputSelect from "../shared/components/FormElements/InputSelect";
import Input from "../shared/components/FormElements/Input";
import Button from "../shared/components/FormElements/Button";
import Card from "../shared/components/UIElements/Card";
import ErrorModal from "../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../shared/components/UIElements/LoadingSpinner";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from "../../src/shared/util/validators";
const UpdatePost = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedPost, setLoadedPost] = useState();
  const navigate = useNavigate();
  const [formState, inputHandler, setFormData] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
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
    },
    false
  );

  const postId = useParams().pid;
  console.log(postId);
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/posts/${postId}`
        );
        console.log(responseData);
        setLoadedPost(responseData.post);
        setFormData(
          {
            // title: {
            //   value: responseData.post.title,
            //   isValid: false,
            // },
            comment: {
              value: responseData.post.comment,
              isValid: false,
            },
            review: {
              value: responseData.post.review,
              isValid: false,
            },
            recommend: {
              value: responseData.post.recommend,
              isValid: false,
            },
          },
          true
        );
      } catch (err) {}
    };
    fetchPost();
  }, [sendRequest, postId, setFormData]);
  console.log(loadedPost);

  const postUpdateSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      await sendRequest(
        `http://localhost:5000/api/posts/${postId}`,
        "PATCH",
        JSON.stringify({
          comment: formState.inputs.comment.value,
          review: formState.inputs.review.value,
          recommend: formState.inputs.recommend.valu,
        }),
        {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          Authorization: "Bearer " + auth.token,
        }
      );
      navigate("/" + auth.userId + "/profile");
    } catch (err) {}
  };
  console.log(postUpdateSubmitHandler);

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!loadedPost && !error) {
    return (
      <div className="center">
        <Card>Could not find place!</Card>
      </div>
    );
  }

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
      <ErrorModal error={error} onClear={clearError} />
      {!isLoading && loadedPost && (
        <form className="post-form" onSubmit={postUpdateSubmitHandler}>
          <Input
            id="comment"
            element="textaera"
            label="Comment"
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="Please enter a valid comment."
            onInput={inputHandler}
            initialValue={loadedPost.comment}
            initialValid={true}
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
            initialValue={loadedPost.review}
            initialValid={true}
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
            defaultValue={loadedPost.recommend}
            initialValid={true}
          />
          <Button type="submit" disabled={!formState.isValid}>
            UNPDATE PLACE
          </Button>
        </form>
      )}
    </React.Fragment>
  );
};

export default UpdatePost;
