import React, { useState, useEffect } from "react";
import {Router, Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import UserContext from "./UserContext.js";
import './App.css';
import { jwtDecode } from "jwt-decode";
import DogBreedList from './BreedList.jsx';
import Homepage from "./Homepage.jsx";
import BreedDetail from "./BreedDetail.jsx";

export const TOKEN_STORAGE_ID = "dog-breed-token";

function App() {

  const [currentUser, setCurrentUser] = useState(null);

  return (
    <>
      <BrowserRouter>
        <UserContext.Provider 
          value={{ currentUser, setCurrentUser }}>
            <Routes>
              <Route exact path="/petlist" element= {<DogBreedList />}>  </Route>
              <Route exact path='/petlist/:id' element = {<BreedDetail />} ></Route>
              <Route exact path="/" element={<Homepage />}></Route>
              <Route path="*" element={<Navigate replace to="/"/>} /> 
            </Routes>         
        </UserContext.Provider>
      </BrowserRouter>
    </>
  )
}

export default App
