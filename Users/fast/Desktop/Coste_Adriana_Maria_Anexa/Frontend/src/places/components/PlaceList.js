import React, { useEffect, useState } from "react";
import Card from "../../shared/components/UIElements/Card";
import PlaceItem from "./PlaceItem";
import Button from "../../shared/components/FormElements/Button";
import "./PlaceList.css";

const PlaceList = (props) => {
  const { items, setReviews, childClicked, reviews, setCoordinates } = props;
  const [totalReviews, setTotalReviews] = useState([]);
  const [postIds, setPostIds] = useState([[]]);
  // console.log({ childClicked });
  // console.log(items);
  const loadedPlaces = props.items[0];
  const loadedPosts = props.items[1];
  // console.log(props.items[1]);

  useEffect(() => {
    if (loadedPosts && loadedPosts.length > 0) {
      const updatedTotalReviews = loadedPlaces.map((item) => {
        let total = 0;
        let count = 0;
        const innerPostIds = [];
        loadedPosts.forEach((subItem) => {
          if (item._id === subItem.placeId) {
            total += parseInt(subItem.review);
            count++;
            innerPostIds.push(subItem._id);
          }
        });
        const average = count > 0 ? total / count : 0;
        // console.log(average);
        setPostIds((prevPostIds) => [...prevPostIds, innerPostIds]);

        return { id: item._id, review: average };
      });
      setTotalReviews(updatedTotalReviews.map((item) => item.review || 0));
    }
  }, [loadedPlaces, loadedPosts]);

  useEffect(() => {
    // console.log("place list:", totalReviews);
  }, [totalReviews]);

  if (props.items.length === 0) {
    return (
      <div className="place-list center">
        <Card>
          <h2>No places found.Maybe create one?</h2>
          <Button to="/places/new">Share Place</Button>
        </Card>
      </div>
    );
  }

  return (
    <ul className="place-list">
      {loadedPlaces.map((place, index) => {
        // let review = totalReviews.length ? totalReviews[index].review : 0;
        // if (typeof review === "undefined") {
        //   // review = 0;
        //   // Ignoră momentan locul dacă review este undefined
        // }
        return (
          <PlaceItem
            key={index}
            id={place._id}
            image={place.image}
            title={place.title}
            description={place.description}
            address={place.address}
            price={place.price}
            type={place.type}
            review={totalReviews[index]}
            phone={place.phone}
            food={place.food}
            creatorId={place.creator}
            coordinates={place.location}
            onDelete={props.onDeletePlace}
          />
        );
      })}
    </ul>
  );
};

export default PlaceList;
