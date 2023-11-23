import React, { useState, useContext } from "react";

// import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";
import Modal from "../../shared/components/UIElements/Modal";
import Map from "../../shared/components/UIElements/MapPlace";
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";
import "./PlaceItem.css";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

import { Card, CardMedia, CardContent } from "@mui/material";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
// import Button from "@mui/material/Button";
import CardActions from "@mui/material";
import Chip from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import Rating from "@mui/material/Rating";

const PlaceItem = (props) => {
  const auth = useContext(AuthContext);
  const [showMap, setShowMap] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const openMapHandler = () => setShowMap(true);

  const closeMapHandler = () => setShowMap(false);

  const showDeleteWarningHandler = () => {
    setShowConfirmModal(true);
  };

  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
  };

  const confirmDeleteHandler = async () => {
    setShowConfirmModal(false);
    try {
      await sendRequest(
        `http://localhost:5000/api/places/${props.id}`,
        "DELETE",
        null,
        { Authorization: "Bearer " + auth.token }
      );
      console.log("apeleaza functia de set state");
    } catch (err) {}
    props.onDelete();
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Modal
        show={showMap}
        onCancel={closeMapHandler}
        header={props.address}
        contentClass="place-item__modal-content"
        footerClass="place-item__modal-actions"
        footer={<Button onClick={closeMapHandler}>CLOSE</Button>}
      >
        <div className="map-container">
          <Map center={props.coordinates} zoom={5} />
        </div>
      </Modal>
      <Modal
        show={showConfirmModal}
        onCancel={cancelDeleteHandler}
        header="Are you sure?"
        footerClass="place-item_modal-actions"
        footer={
          <React.Fragment>
            <Button inverse onClick={cancelDeleteHandler}>
              CANCEL
            </Button>
            <Button danger onClick={confirmDeleteHandler}>
              DELETE
            </Button>
          </React.Fragment>
        }
      >
        <p>
          Do you want to proceed and delete this place? Please note that it
          can't be undone thereafter
        </p>
      </Modal>

      <li className="place-item">
        <Card elevation={6}>
          {isLoading && <LoadingSpinner />}
          <div className="place-item__image">
            <img
              src={`http://localhost:5000/${props.image}`}
              alt={props.item}
            />
          </div>
          {/* <CardMedia
            // style={(className = "place-item__image")}
            src={`http://localhost:5000/${props.image}`}
            alt={props.item}
            media="place-item__image"
          /> */}
          {/* <div className="place-item__info">
            <h2>{props.title}</h2>
            <h3>{props.address}</h3>
            <p>{props.description}</p>
          </div> */}
          <CardContent>
            <Typography gutterBoottom variant="h6">
              {props.title}
            </Typography>
            <Rating
              name="half-rating-read"
              value={props.review ? props.review : 0}
              precision={0.5}
              readOnly
            />
            <Typography gutterBoottom variant="body2">
              {props.description}
            </Typography>
            <Box display="flex" justifyContent="space-between">
              <Typography variant="subtitle1">Price</Typography>
              <Typography gutterBoottom variant="subtitle1">
                {props.price}
              </Typography>
            </Box>
            <Box display="flex" justifyContent="space-between">
              <Typography
                gutterBoottom
                variant="subtitle2"
                color="textSecondary"
              >
                <LocationOnIcon />
                {props.address}
              </Typography>
            </Box>
            <Box display="flex" justifyContent="space-between">
              <Typography
                gutterBoottom
                variant="subtite2"
                color="textSecondary"
              >
                <PhoneIcon />
                {props.phone}
              </Typography>
            </Box>
          </CardContent>
          {/* <Button
            size="small"
            color="primary"
            onClick={() => window.open(props.site, "_blank")}
          >
            Website
          </Button> */}
          <div className="place-item__actions">
            {/* <Button inverse onClick={openMapHandler}>
              VIEW ON MAP
            </Button> */}
            {auth.userId === props.creatorId && (
              <Button to={`/places/${props.id}`}>EDIT</Button>
            )}
            {auth.userId === props.creatorId && (
              <Button danger onClick={showDeleteWarningHandler}>
                DELETE
              </Button>
            )}
          </div>
        </Card>
      </li>
    </React.Fragment>
  );
};

export default PlaceItem;
