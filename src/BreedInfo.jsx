import React, { useState } from 'react';
import axios from 'axios';

const BreedInfo = (PET_API) => {
    const [breed, setBreed] = useState('');
    const [breedInfo, setBreedInfo] = useState(null);
    const [error, setError] = useState(null);

    const handleChange = (event) => {
        setBreed(event.target.value);
    };

    const handleSubmit = async (event) => {
      event.preventDefault();
      try {
          const response = await axios.get(`https://api.petfinder.com/v2/types/dog/breeds/${breed}`, {
              headers: {
                  Authorization: `Bearer ${PET_API}`,
              },
          });
          setBreedInfo(response.data.breed);
          setError(null);
      } catch (error) {
          setBreedInfo(null);
          setError('Breed not found.');
      }
   };

  return (
      <div className="container">
          <h1>Search for a Dog Breed</h1>
          <form onSubmit={handleSubmit}>
              <input type="text" value={breed} onChange={handleChange} placeholder="Enter breed name" />
              <button type="submit">Search</button>
          </form>
          {error && <p>{error}</p>}
          {breedInfo && (
              <div>
                  <h2>{breedInfo.name}</h2>
                  <p>{breedInfo.description}</p>
                  <img src={breedInfo.image.url} alt={breedInfo.name} />
              </div>
          )}
      </div>
  );
};

export default BreedInfo;