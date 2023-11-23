import React, { useState, useContext } from "react";
import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";
import Modal from "../../shared/components/UIElements/Modal";
import MapPost from "../../shared/components/UIElements/MapPost";
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import CardHeader from "@mui/material/CardHeader";
import Avatar from "@mui/material/Avatar";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Rating } from "@mui/material";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LanguageIcon from "@mui/icons-material/Language";
import "./PostItem.css";

const PostItem = (props) => {
  const auth = useContext(AuthContext);
  const [showMap, setShowMap] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const { isDeleted, setIsDeleted } = useState(true);
  const formattedDate = props.createdAt
    ? new Date(props.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
      })
    : "Date not available yet";

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
        `http://localhost:5000/api/posts/${props.id}`,
        "DELETE",
        null,
        { Authorization: "Bearer " + auth.token }
      );
      props.onDelete(props.id);
    } catch (err) {}
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />

      <Modal
        show={showMap}
        onCancel={closeMapHandler}
        header={props.address}
        contentClass="post-item__modal-content"
        footerClass="post-item__modal-actions"
        footer={<Button onClick={closeMapHandler}>CLOSE</Button>}
      >
        <div className="map-container">
          <MapPost center={props.coordinates} zoom={5} />
        </div>
      </Modal>
      <Modal
        show={showConfirmModal}
        onCancel={cancelDeleteHandler}
        header="Are you sure?"
        footerClass="post-item_modal-actions"
        footer={
          <React.Fragment>
            <Button
              inverse
              onClick={cancelDeleteHandler}
              showDeleteWarningHandler
            >
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

      <li className="post-item">
        <Card className="post-item__content">
          <a href={`/${props.userId}/profile`}>
            <CardHeader
              avatar={
                <Avatar src={`http://localhost:5000/${props.userImage}`} />
              }
              title={
                <h4 className="post-card-user-name">
                  {props.userFirstName}&nbsp;
                  {props.userLastName}
                </h4>
              }
              subheader={formattedDate}
              className="post-card-header"
            />
          </a>
          <div className="post-item__image">
            <img
              src={`http://localhost:5000/${props.image}`}
              alt={props.item}
            />
          </div>

          <CardContent className="card-body">
            <div className="post-title-container">
              <div className="title">
                <Typography variant="subtitle2" component="p">
                  {props.title}
                </Typography>
              </div>
            </div>

            <div className="post-review">
              <Rating
                name="read-only"
                value={parseInt(props.review)}
                readOnly
              />
            </div>

            <Card className="post-comment">
              <Typography
                variant="caption text"
                component="p"
                className="post-comment-text"
              >
                {props.comment}
              </Typography>
            </Card>
            <div className="div-address">
              {props.recommend === "true" ? (
                <ThumbUpAltIcon />
              ) : (
                <ThumbDownAltIcon />
              )}
              <div>
                {props.recommend === "true" ? (
                  <Typography
                    variant="body2"
                    component="p"
                    className="text-address"
                  >
                    I recommend
                  </Typography>
                ) : (
                  <Typography
                    variant="body2"
                    component="p"
                    className="text-address"
                  >
                    I don't recommend
                  </Typography>
                )}
              </div>
            </div>
            <div className="div-address">
              <LocationOnIcon />
              <Typography
                variant="body2"
                component="p"
                className="text-address"
              >
                {props.address}
              </Typography>
            </div>
            <div className="div-address">
              <LanguageIcon />
              <Typography
                variant="body2"
                component="p"
                className="text-address"
              >
                {props.site}
              </Typography>
            </div>
          </CardContent>
          <div className="post-item__actions">
            {auth.userId === props.creatorId && (
              <Button to={`/posts/${props.id}`}>EDIT</Button>
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

export default PostItem;
