import React, { useState, useEffect } from "react";
import Card from "../../shared/components/UIElements/Card";
import PostItem from "./PostItem";
import Button from "../../shared/components/FormElements/Button";
import "./PostList.css";

const PostList = (props) => {
  const { loadedPosts, loadedPlaces, loadedUser } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [usedPlaceOfCurrentPosts, setUsedPlaceOfCurrentPosts] = useState([]);
  const [usedUserOfCurrentPost, setUsedUserOfCurrentPost] = useState();

  useEffect(() => {
    const findMatchingPlaces = () => {
      console.log();
      const matchedPlaces = [];
      const matchedUsers = [];

      for (let i = 0; i < props.items[0].length; i++) {
        const matchingPlaces = props.items[1].filter(
          (place) => place._id === props.items[0][i].placeId
        );

        if (Array.isArray(props.items[2])) {
          const matchingUsers = props.items[2].filter(
            (user) => user._id === props.items[0][i].creator
          );
          if (matchingUsers.length > 0) {
            const matchingUser = matchingUsers[0];
            console.log(matchedUsers);
            matchedUsers.push(matchingUser);
          }
        } else {
          matchedUsers.push(props.items[2]);
        }

        if (matchingPlaces.length > 0) {
          const matchingPlace = matchingPlaces[0];
          matchedPlaces.push(matchingPlace);
        }
      }
      setUsedPlaceOfCurrentPosts(matchedPlaces);
      setUsedUserOfCurrentPost(matchedUsers);
    };

    findMatchingPlaces();
  }, [props.items]);

  if (props.items.length === 0) {
    return (
      <div className="post-list center">
        <Card>
          <h2>No places found.Maybe create one?</h2>
          <Button>Share Post</Button>
        </Card>
      </div>
    );
  }
  return (
    <React.Fragment>
      {!isLoading && usedPlaceOfCurrentPosts && usedUserOfCurrentPost && (
        <ul className="post-list">
          {props.items[0].map((post, index) => {
            const usedPlaceOfCurrentPost = usedPlaceOfCurrentPosts[index];
            const usedUser = usedUserOfCurrentPost[index];
            return (
              <PostItem
                key={post._id}
                id={post._id}
                image={post.image}
                title={post.title}
                comment={post.comment}
                review={post.review}
                recommend={post.recommend}
                createdAt={post.createdAt}
                address={usedPlaceOfCurrentPost.address}
                coordinates={usedPlaceOfCurrentPost.location}
                site={usedPlaceOfCurrentPost.site}
                userId={usedUser._id}
                userFirstName={usedUser.firstname}
                userLastName={usedUser.lastname}
                userImage={usedUser.image}
                placeId={post.placeId}
                creatorId={post.creator}
                onDelete={props.onDeletePlace}
              />
            );
          })}
        </ul>
      )}
    </React.Fragment>
  );
};

export default PostList;
