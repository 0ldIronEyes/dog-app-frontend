
import React, { useState } from 'react';

import DogBreedApi from './api';
//import './form.css';

//Component for first tab of Search page. For searching for breeds by name
const BreedSearchForm = ({ setDogBreeds }) => {
  const [searchTerm, setSearchTerm] = useState('');
  

  const handleSearch = async (e) => {
    e.preventDefault();
    try{
      console.log(searchTerm);
      const dogs = await DogBreedApi.getByName(searchTerm);
      setDogBreeds(dogs);
      console.log(dogs);
    }
    catch(error)
    {
      console.error('Error fetching pets by name:', error);
    }
  
  };

  return (
  <div className="form-container">
    <form onSubmit={handleSearch}>
      <input
        type="text"
        className='search-input'
        placeholder="Enter a dog breed"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button className='search-button' type="submit">Search</button>
    </form>
  </div>
  );
};

export default BreedSearchForm;
