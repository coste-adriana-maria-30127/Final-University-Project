import React, { useEffect, useState, useContext } from "react";
import PostList from "../components/PostList";
import { useParams } from "react-router-dom";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";

const UserPosts = () => {
  const auth = useContext(AuthContext);
  const [loadedPosts, setLoadedPosts] = useState([]);
  const [loadedPlaces, setLoadedPlaces] = useState([]);

  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const userId = useParams().uid;
  console.log(userId);
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/posts/user/${userId}`
        );
        console.log(sendRequest);
        setLoadedPosts(responseData.posts);
      } catch (err) {}
    };
    fetchPosts();
  }, [sendRequest, userId]);
  console.log(loadedPlaces);
  return <PostList items={loadedPosts} />;
};
export default UserPosts;
