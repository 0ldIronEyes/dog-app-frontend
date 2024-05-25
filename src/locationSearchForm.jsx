import React, { useState,useContext } from 'react';
import "./style.css";
import UserContext from "./UserContext.js";


//Search form for searching for available pets. Has button for user to use to search for pets by zip code of user instead of 
//manually entering it. 
const LocationSearchForm = ({ onSubmit }) => {
  const [city, setCity] = useState('');
  const { currentUser } = useContext(UserContext);

  //button function for searching by user's zip code
  function searchUsersLocation()
  {
     setCity('');
     onSubmit(currentUser.userlocation);
  }

  //called when location manually entered
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(city);
    setCity('');
  };

  return (
    <>
    <h1> Find adoptable pets near you</h1>
    <div> <button className="search-button" onClick={searchUsersLocation}> Search Using your Zip Code </button></div>
    <form onSubmit={handleSubmit}>
      <label htmlFor="cityInput"> Or Enter a different zip code:</label> <br />
      <input
        type="text"
        id="city-input"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        required
      />
      <button type="submit">Search</button>
    </form>
    </>
    
  );
};

export default LocationSearchForm;