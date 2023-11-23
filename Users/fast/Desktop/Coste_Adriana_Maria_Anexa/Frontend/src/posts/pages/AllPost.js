import React, { useEffect, useState } from "react";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import PostList from "../components/PostList";

const AllPosts = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedPosts, setLoadedPosts] = useState();

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
  }, [sendRequest]);
  console.log(loadedPosts);

  return (
    <React.Fragment>
      <p>Hello</p>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedPosts && <PostList items={loadedPosts} />}
    </React.Fragment>
  );
};

export default AllPosts;
