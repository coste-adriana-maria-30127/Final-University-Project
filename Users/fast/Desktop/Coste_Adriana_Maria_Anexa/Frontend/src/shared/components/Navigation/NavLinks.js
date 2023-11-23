import React, { useContext } from "react";
import Button from "../FormElements/Button";
import { NavLink } from "react-router-dom";

import { AuthContext } from "../../context/auth-context";
import "./NavLinks.css";
import { useAuth } from "../../hooks/auth-hook";

const NavLinks = (props) => {
  const auth = useContext(AuthContext);
  const { userRole } = useAuth();

  return (
    <ul className="nav-links">
      {auth.isLoggedIn && (
        <li>
          <NavLink to={`/${auth.userId}/main/page`}>MAIN PAGE</NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <NavLink to={`/${auth.userId}/profile`}>MY PROFILE</NavLink>
        </li>
      )}
      <li>
        <NavLink to="/" exact>
          EXPLORE ATTRACTIONS
        </NavLink>
      </li>
      {userRole === "Admin" && (
        <li>
          <NavLink to={`/${auth.userId}/places/administration`}>
            PLACES ADMINISTRATION
          </NavLink>
        </li>
      )}
      {!auth.isLoggedIn && (
        <li>
          <NavLink to="/auth">AUTHENTICATE</NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <NavLink to="/auth" onClick={auth.logout}>
            LOGOUT
          </NavLink>
        </li>
      )}
    </ul>
  );
};

export default NavLinks;
