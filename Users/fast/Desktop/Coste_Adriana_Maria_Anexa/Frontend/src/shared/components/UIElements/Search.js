import React, { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";

const Search = () => {
  return (
    <div className="main-header-right-div">
      <Box display="flex">
        <Typography variant="h6" className="title">
          Explor new places
        </Typography>
        <div className="search">
          <div className="searchIcon">
            <SearchIcon />
          </div>
          <InputBase placeholder="Search ..." />
        </div>
      </Box>
    </div>
  );
};

export default Search;
