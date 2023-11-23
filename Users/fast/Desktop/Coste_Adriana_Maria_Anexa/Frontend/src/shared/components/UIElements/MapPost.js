import React from "react";
import "./MapPlace.css";
import GoogleMapReact from "google-map-react";
const APY_KEY = process.env.APY_KEY;

const MapPost = (props) => {
  return (
    <div className={`map-place ${props.className}`}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: APY_KEY }}
        defaultCenter={props.center}
        center={props.center}
        defaultZoom={props.zoom}
        margin={[50, 50, 50, 50]}
      ></GoogleMapReact>
    </div>
  );
};

export default MapPost;
