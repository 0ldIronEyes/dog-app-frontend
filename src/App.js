import React, { useState, useEffect } from "react";
import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import useLocalStorage from "./useLocalStorage.js";
import UserContext from "./UserContext.js";
import './App.css';

import { jwtDecode } from "jwt-decode";
import ProfileInfo from "./ProfileInfo.js";
import ProfileForm from "./ProfileForm.js";
import LoadingSpinner from "./LoadingSpinner.js";
import PrivateRoute from "./PrivateRoute.js";
import DogBreedApi from "./api.js";
import Homepage from "./Homepage.js";
import BreedDetail from "./BreedDetail.js";

import { signup, login, toggleFavorites, logout } from "./authHelpers.js";

export const TOKEN_STORAGE_ID = "dog-breed-token";

function App() {

  const [currentUser, setCurrentUser] = useState(null);
  const [infoLoaded, setInfoLoaded] = useState(false);
  const [token, setToken] = useLocalStorage(TOKEN_STORAGE_ID);
  const [favorites, setFavorites] = useState(new Set([]));

  useEffect(function loadUserInfo() {
    console.debug("App useEffect loadUserInfo", "token=", token);

    async function getCurrentUser() {
      if (token) {
        try {
          let { username } = jwtDecode(token);
          DogBreedApi.token = token;
          let currentUser = await DogBreedApi.getCurrentUser(username);
          setCurrentUser(currentUser);
          setFavorites(new Set(currentUser.breeds));
          setInfoLoaded(true);
        } catch (err) {
          console.error("App loadUserInfo: problem loading", err);
          setInfoLoaded(true);
          setCurrentUser(null);
        }
      }
      setInfoLoaded(true);
    }

    setInfoLoaded(false);
    getCurrentUser();
  }, [token]);


  if (!infoLoaded) return <LoadingSpinner />;

  return (
    <>
      <BrowserRouter>
        <UserContext.Provider 
          value={{ currentUser, setCurrentUser, favorites, setFavorites, 
                   toggleFavorites: (breed, life, height, weight) => toggleFavorites(currentUser, favorites, setFavorites, breed, life, height, weight), 
                   signup: (data) => signup(data, setToken), 
                   login: (data) => login(data, setToken), 
                   logout }}>
          <Routes>
            <Route path='/petlist/:id' element={<BreedDetail />} ></Route>
            <Route path="/account/:username" element={<PrivateRoute><ProfileInfo /></PrivateRoute>}></Route>       
            <Route path="/edit" element={<PrivateRoute><ProfileForm /></PrivateRoute>}></Route>                
            <Route path="/" element={<Homepage />}></Route>
            <Route path="*" element={<Navigate replace to="/" />} /> 
          </Routes>         
        </UserContext.Provider>
      </BrowserRouter>
    </>
  )
}

export default App;