import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Box, Typography, InputBase } from "@mui/material";
import { Autocomplete } from "@react-google-maps/api";
import SearchIcon from "@mui/icons-material/Search";

import "./MainHeader.css";

const MainHeader = (props) => {
  const { coordinates, setCoordinates } = props;
  const location = useLocation();
  const showSearchBar = location.pathname === "/";

  const [autocomplete, setAutocomplete] = useState(null);

  const onLoad = (autoC) => setAutocomplete(autoC);
  const onPlaceChanged = () => {
    const lat = autocomplete.getPlace().geometry.location.lat();
    const lng = autocomplete.getPlace().geometry.location.lng();
    console.log(lat);
    console.log(lng);

    setCoordinates({ lat, lng });
  };

  return (
    <header className="main-header">
      <div className="main-header-container">
        <div className="div-props-children">{props.children}</div>
        {showSearchBar && (
          <div className="main-header-right-div">
            <Box display="flex">
              <Typography variant="h6" className="title">
                Explore new places
              </Typography>
              <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
                <div className="search">
                  <div className="searchIcon">
                    <SearchIcon />
                  </div>
                  <InputBase placeholder="Search ..." />
                </div>
              </Autocomplete>
            </Box>
          </div>
        )}
      </div>
    </header>
  );
};

export default MainHeader;
