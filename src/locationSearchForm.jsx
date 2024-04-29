import React, { useState } from 'react';

const CitySearchForm = ({ onSubmit }) => {
  const [city, setCity] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(city);
    setCity('');
  };

  return (
    <>
    <h1> Find adoptable pets near you</h1>
    <form onSubmit={handleSubmit}>
      <label htmlFor="cityInput">Enter your zip code:</label> <br />
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

export default CitySearchForm;