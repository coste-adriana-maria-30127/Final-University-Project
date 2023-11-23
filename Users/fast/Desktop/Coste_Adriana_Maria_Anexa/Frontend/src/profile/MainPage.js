import React, { useState, useEffect } from "react";
import { useHttpClient } from "../shared/hooks/http-hook";
import ErrorModal from "../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../shared/components/UIElements/LoadingSpinner";
import PostList from "../posts/components/PostList";

const MainPage = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedPosts, setLoadedPosts] = useState();
  const [loadedPlaces, setLoadedPlaces] = useState();
  const [loadedUsers, setLoadedUsers] = useState();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const responsData = await sendRequest(
          "http://localhost:5000/api/posts"
        );
        setLoadedPosts(responsData.posts);
      } catch (err) {}
    };
    fetchPosts();

    const fetchPlaces = async () => {
      try {
        const responsData = await sendRequest(
          "http://localhost:5000/api/places"
        );
        setLoadedPlaces(responsData.places);
      } catch (err) {}
    };
    fetchPlaces();

    const fetchUsers = async () => {
      try {
        const responsData = await sendRequest(
          `http://localhost:5000/api/users`
        );
        setLoadedUsers(responsData.users);
      } catch (err) {}
    };
    fetchUsers();
  }, [sendRequest]);
  // console.log(loadedUsers);

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedPosts && loadedPlaces && loadedUsers && (
        <PostList items={[loadedPosts, loadedPlaces, loadedUsers]} />
      )}
    </React.Fragment>
  );
};

export default MainPage;
