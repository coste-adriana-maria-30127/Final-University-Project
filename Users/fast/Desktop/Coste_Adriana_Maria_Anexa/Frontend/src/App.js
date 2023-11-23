import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Grid from "@mui/material/Grid";
import FindAttractions from "./places/pages/FindAttraction";
import PlacesAdministration from "./places/pages/PlacesAdministration";
import AllPlaces from "./places/pages/AllPlaces";

import UserPosts from "./posts/pages/UserPosts";
import Users from "./user/pages/Users";
import NewPlace from "./places/pages/NewPlace";
import UserPlaces from "./places/pages/UserPlaces";
import MainNavigation from "./shared/components/Navigation/MainNavigation";
import UpdatePlace from "./places/pages/UpdatePlace";
import MyProfile from "./profile/MyProfile";
import Auth from "./user/pages/Auth";
import Register from "./user/pages/Register";
import { AuthContext } from "./shared/context/auth-context";
import { useAuth } from "./shared/hooks/auth-hook";
import SideDrawer from "./shared/components/Navigation/SideDrawer";
// import ProfilulMeu from "./posts/pages/ProfilulMeu";
import UpdatePost from "./profile/UpdatePost";
// import AllPosts from "../src/posts/pages/AllPosts";
import MainPage from "./profile/MainPage";

const App = () => {
  const [coordinates, setCoordinates] = useState({});
  const [reviews, setReviews] = useState([]);

  const { token, login, logout, userId, userRole } = useAuth();

  useEffect(() => {
    // console.log("app", reviews);
  }, [reviews]);

  // console.log(userRole);

  let routes;

  if (token) {
    routes = (
      <React.Fragment>
        <Route
          path="/"
          element={
            <FindAttractions
              reviews={reviews}
              setReviews={setReviews}
              coordinates={coordinates}
              setCoordinates={setCoordinates}
            />
          }
          exact
        />
        <Route path="/places" element={<AllPlaces />} exact />
        {/* <Route path="/:uid/places" element={<UserPlaces />} /> */}
        {/* <Route path="/places/new" element={<NewPlace />} /> */}
        {/* <Route path="/:uid/posts" element={<UserPosts />} /> */}
        <Route path="/posts/:pid" element={<UpdatePost />} />
        <Route path="/:uid/main/page" element={<MainPage />} />
        <Route
          path="/:uid/places/administration"
          element={
            userRole === "Admin" ? (
              <PlacesAdministration
                setCoordinates={setCoordinates}
                reviews={reviews}
                setReviews={setReviews}
              />
            ) : (
              <div />
            )
          }
        />
        <Route path="/places/:placeId" element={<UpdatePlace />} />
        <Route path="/:uid/profile" element={<MyProfile />} />
        <Route path="/auth" element={<Navigate to="/:uid/main/page" />} />
        <Route path="/register" element={<Navigate to="/:uid/main/page" />} />
      </React.Fragment>
    );
  } else {
    routes = (
      <React.Fragment>
        <Route
          path="/"
          element={
            <FindAttractions
              coordinates={coordinates}
              setCoordinates={setCoordinates}
            />
          }
          exact
        />

        {/* <Route path="/places" element={<AllPlaces />} exact /> */}
        {/* <Route path="/" element={<Users />} exact /> */}
        <Route path="/:uid/places" element={<UserPlaces />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/register" element={<Register />} />
        <Route path="/auth" element={<Navigate to="/auth" />} />
      </React.Fragment>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        userId: userId,
        login: login,
        logout: logout,
      }}
    >
      <Router>
        <MainNavigation
          coordinates={coordinates}
          setCoordinates={setCoordinates}
        />
        <main className="body">
          <Routes>{routes}</Routes>
        </main>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
