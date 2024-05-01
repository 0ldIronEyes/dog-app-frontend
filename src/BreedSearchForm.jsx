
import React, { useState } from 'react';
import axios from 'axios';
import './form.css';


const BreedSearchForm = ({ setDogBreeds }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get('https://dog-app-backend.onrender.com/api/breeds', {
          params: {search: searchTerm} 
        });
      setDogBreeds(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
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
