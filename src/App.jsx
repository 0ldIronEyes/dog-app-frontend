import React, { useState, useEffect } from "react";
import {Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import useLocalStorage from "./useLocalStorage";
import UserContext from "./UserContext.js";
import './App.css';

import {jwtDecode } from "jwt-decode";
import ProfileInfo from "./ProfileInfo.jsx";
import ProfileForm from "./ProfileForm.jsx";
import LoadingSpinner from "./LoadingSpinner.jsx";
import PrivateRoute from "./PrivateRoute.jsx";
import DogBreedApi from "./api";
import DogBreedList from './BreedList.jsx';
import Homepage from "./Homepage.jsx";
import BreedDetail from "./BreedDetail.jsx";

export const TOKEN_STORAGE_ID = "dog-breed-token";

function App() {

  const [currentUser, setCurrentUser] = useState(null);
  const [infoLoaded, setInfoLoaded] = useState(false);
  const [token, setToken] = useLocalStorage(TOKEN_STORAGE_ID);
  const [favorites, setFavorites] = useState(new Set([]));

  useEffect(function loadUserInfo() {
    //console.debug("App useEffect loadUserInfo", "token=", token);

    async function getCurrentUser() {
      if (token) {
        try {
          let { username } = jwtDecode(token);
          DogBreedApi.token = token;
          let currentUser = await DogBreedApi.getCurrentUser(username);
          setCurrentUser(currentUser);
          setFavorites(new Set(currentUser.breeds));
        } catch (err) {
          //console.error("App loadUserInfo: problem loading", err);
          setCurrentUser(null);
        }
      }
      setInfoLoaded(true);
    }

    setInfoLoaded(false);
    getCurrentUser();
  }, [token]);

 /** Handles site-wide logout. */
  function logout() {
    setCurrentUser(null);
    setToken(null);
  }

  /** Handles sign up. */
  async function signup(signupData) {
    try {
      let token = await DogBreedApi.signup(signupData);
      setToken(token);
      DogBreedApi.token = token;
      return { success: true };
    } catch (errors) {
      //console.error("signup failed", errors);
      return { success: false, errors };
    }
  }

  /** Handles sign up. */
  async function login(loginData) {
    try {
      let token = await DogBreedApi.login(loginData);
      setToken(token);
      DogBreedApi.token = token;
      return { success: true };
    } catch (errors) {
      return { success: false, errors };
    }
  }

    /** Add to favorites list if not already included, remove otherwise */
  function toggleFavorites(favoriteBreed, life, height, weight) {
    if (favorites.has(favoriteBreed))
    {
  
        DogBreedApi.removeFromFavorites(currentUser.username, favoriteBreed);
        setFavorites(new Set([...favorites].filter(breed => breed !== favoriteBreed)));
    } 
    else{
      DogBreedApi.addToFavorites(currentUser.username, favoriteBreed, life, height, weight);
      setFavorites(new Set([...favorites, favoriteBreed]));
    }
    
  }

  
  if (!infoLoaded) return <LoadingSpinner />;


  return (
    <>
      <BrowserRouter>
        <UserContext.Provider 
          value={{ currentUser, setCurrentUser, favorites, setFavorites, toggleFavorites, signup, login, logout}}>
            <Routes>
              <Route  path='/petlist/:id' element = {<BreedDetail />} ></Route>
              <Route  path="/account/:username" element ={<PrivateRoute><ProfileInfo /></PrivateRoute>}> </Route>       
              <Route  path="/edit" element ={<PrivateRoute><ProfileForm /></PrivateRoute>}> </Route>                
              <Route  path="/" element={<Homepage/>}></Route>
              <Route path="*" element={<Navigate replace to="/"/>} /> 
            </Routes>         
        </UserContext.Provider>
      </BrowserRouter>
    </>
  )
}

export default App