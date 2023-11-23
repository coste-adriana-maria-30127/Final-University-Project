import React, { useState } from "react";
import "./MapPlace.css";
import GoogleMapReact from "google-map-react";
import Paper from "@mui/material/Paper";
import { Typography, useMediaQuery } from "@mui/material";

const APY_KEY = process.env.REACT_APP_MAPS_API_KEY;

const MapPlace = (props) => {
  console.log("AAAAAAAAAAAAAAAAAAAAA", { APY_KEY });

  const { setCoordinates, setBounds, loadedPlaces, setChildClicked } = props;

  const isDesktop = useMediaQuery("(min-width:600px)");
  const center = {
    lat: 30,
    lng: 30,
  };
  const [activeMarker, setActiveMarker] = useState(null);

  const handleMarkerClick = (marker) => {
    setActiveMarker(marker);
  };

  return (
    <div className={`map-place ${props.className}`}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: APY_KEY }}
        defaultCenter={center}
        center={props.coordinates}
        defaultZoom={props.zoom}
        margin={[50, 50, 50, 50]}
        onChange={(e) => {
          console.log("coords", e);
          setCoordinates({ lat: e.center.lat, lng: e.center.lng });
          if (e.marginBounds.ne && e.marginBounds.sw) {
            setBounds({
              ne: e.marginBounds.ne,
              nw: e.marginBounds.nw,
              se: e.marginBounds.se,
              sw: e.marginBounds.sw,
            });
          }
        }}
        onChildClick={(child) => {
          setChildClicked(child);
        }}
      >
        {loadedPlaces?.map((place, index) => {
          return (
            <Marker
              lat={place.location.lat}
              lng={place.location.lng}
              key={index}
              props={place}
              color="red"
              onClick={() => handleMarkerClick(place)}
            ></Marker>
          );
        })}
      </GoogleMapReact>
    </div>
  );
};

const Marker = ({ props, color, onClick }) => {
  return (
    <div className="div-marker" onClick={onClick}>
      <Paper elevation={3} className="map-paper">
        <Typography variant="subtitle2" gutterBottom>
          {props.title}
        </Typography>
        <img src={`http://localhost:5000/${props.image}`} alt={props.title} />
      </Paper>
    </div>
  );
};

export default MapPlace;
