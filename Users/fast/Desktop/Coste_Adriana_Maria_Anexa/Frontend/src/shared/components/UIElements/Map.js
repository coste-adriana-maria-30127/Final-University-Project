import React from "react";
import "./Map.css";
import GoogleMapReact from "google-map-react";

const Map = (props) => {
  return (
    <div className={`map ${props.className}`}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: "AIzaSyAYA75MsAOvlgyc666R-LC9OWr_24loZSM" }}
        defaultCenter={props.center}
        center={props.center}
        defaultZoom={props.zoom}
        margin={[50, 50, 50, 50]}
      ></GoogleMapReact>
    </div>
  );
};

export default Map;
