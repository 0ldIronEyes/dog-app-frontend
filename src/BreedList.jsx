import React, {useState, useContext } from 'react';
import UserContext from "./UserContext";
import  {Link }  from 'react-router-dom';
import './listStyle.css';

import defaultImage from './assets/dog_icon.png';


//Displays the list of dog breeds returned by the search and populates their information in their box. 
//Users can also favorite breeds to their account.
const DogBreedList = ({ dogBreeds }) => {

  const { favorites, toggleFavorites } = useContext(UserContext);
  const [currentPage, setCurrentPage] = useState(1);
  const breedsPerPage = 20;

  const indexOfLastBreed = currentPage * breedsPerPage;
  const indexOfFirstBreed = indexOfLastBreed - breedsPerPage;
  const currentBreeds = dogBreeds.slice(indexOfFirstBreed, indexOfLastBreed);


  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  //toggle function for favoriting or unfavoriting breeds.
  function buttonToggle(event,breedName, lifeSpan, height, weight)
  {
    console.log("toggle breedname: ", breedName);
    toggleFavorites(breedName, lifeSpan, height, weight);
    const button = event.target;
    if (favorites.has(breedName)) {
      button.className = 'fav-button';
      button.textContent = 'Favorite';
    } else {
      button.className = 'fav-button-active';
      button.textContent = 'Unfavorite';
    }
  }


  return (
    <div className="breed-recommendations" >
     {dogBreeds.length > 0 &&  (<h2>Dog Breed Recommendations</h2> )} 
      <ul className="breed-list">
        {currentBreeds.map((breed) => {
          const buttonClass = favorites.has(breed.breedName) ? 'fav-button-active' : 'fav-button';
          const favorited = favorites.has(breed.breedName) ? 'Unfavorite' : 'Favorite';

          return (
          <li  className="breed-item" key={breed.id}> 
              <div> <button className={buttonClass} onClick={(event) => buttonToggle(event,breed.breedName, breed.maxLifeSpan, breed.maxHeightInches, breed.maxWeightPounds)}>
                   {favorited} </button>
              </div>
           <div className="breed-name" ><Link to={`/petList/${breed.id}`}>{breed.breedName}</Link>   </div>
          <div  className="breed-info">
              <div className="breed-image"> <img src ={breed.imgSourceURL || defaultImage} alt="breed image"/> </div>        
               <div >
                    <div className="breed-description">
                        {breed.breedDescription}
                    </div>
                </div>
          </div>         
          <div >
            <div className="breed-stats">
                <div >
                    <strong>Weight:</strong> <br /> {breed.maxWeightPounds} lbs
                </div>
                <div >
                    <strong>Height:</strong>  <br />{breed.maxHeightInches} ln
                </div>
                <div>
               <strong>Life Expectancy:</strong> <br/> {breed.maxLifeSpan} years
            </div>
            </div>        
          </div>
          </li>
        )}
        )}
      </ul>
      <div>
        {dogBreeds.length > breedsPerPage && (
          <ul className="pagination">
            {Array(Math.ceil(dogBreeds.length / breedsPerPage))
              .fill(0)
              .map((children, index) => (
                <li key={index} className={currentPage === index + 1 ? 'active' : null}>
                  <button onClick={() => paginate(index + 1)}>{index + 1}</button>
                </li>
              ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default DogBreedList;



