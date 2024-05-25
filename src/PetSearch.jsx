import React, { useState } from 'react';
import "./style.css";
import defaultImage from './assets/dog_icon.png';

const PetSearch = ({ pets, breedName }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const petsPerPage = 3;

  if (!pets) {
    return null;
  }

  const indexOfLastPet = currentPage * petsPerPage;
  const indexOfFirstPet = indexOfLastPet - petsPerPage;
  const currentPets = pets.slice(indexOfFirstPet, indexOfLastPet);

  const totalPages = Math.ceil(pets.length / petsPerPage);

  const handlePrevious = () => {
    setCurrentPage((prevPage) => (prevPage > 1 ? prevPage - 1 : prevPage));
  };

  const handleNext = () => {
    setCurrentPage((prevPage) => (prevPage < totalPages ? prevPage + 1 : prevPage));
  };

  return (
    <>
      <div>
        <h3>{breedName} to adopt:</h3>
        <ul className='pet-list'>
          {currentPets.map((pet) => (
            <li className="pet-entry" key={pet.id}>
              <div className='pet-pic'>
                <img src={pet.photos.length > 0 ? pet.photos[0].medium : defaultImage} alt="breed image" />
              </div>
              <div className="pet-info">
                <div className='pet-name'>{pet.name}</div>
                <div className='pet-small-details'>
                  <div className='centered-small-text'>
                    <span className="pet-gender">{pet.gender}</span>
                    <strong> |  Age:</strong> {pet.age}<br />
                  </div>
                </div>
                <div><strong>Contact:</strong> <a href={`mailto:${pet.contact.email}`}>{pet.contact.email}</a> </div>
                <strong>Description:</strong> {pet.description} <br />

              </div>
            </li>
          ))}
        </ul>
        <div className="pet-pagination">
          <button onClick={handlePrevious} className="search-button" disabled={currentPage === 1}>Previous</button>
          <span>Page {currentPage} of {totalPages}</span>
          <button onClick={handleNext} className="search-button" disabled={currentPage === totalPages}>Next</button>
        </div>
      </div>
    </>
  );
};

export default PetSearch;
