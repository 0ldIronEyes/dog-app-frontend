import React, {useState } from 'react';
import  {Link, useNavigate }  from 'react-router-dom';
import './listStyle.css';

import defaultImage from './assets/dog_icon.png';

const DogBreedList = ({ dogBreeds }) => {

  const nav = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const breedsPerPage = 20;

  const indexOfLastBreed = currentPage * breedsPerPage;
  const indexOfFirstBreed = indexOfLastBreed - breedsPerPage;
  const currentBreeds = dogBreeds.slice(indexOfFirstBreed, indexOfLastBreed);

  

  const paginate = (pageNumber) => setCurrentPage(pageNumber);


  const handleNavigateToDetail = (breedID) => {
    console.log(breedID);
    nav( '/detail' , { state: { breedID: breedID } });

  };

  return (
    <div className="breed-recommendations" >
     {dogBreeds.length > 0 &&  (<h2>Dog Breed Recommendations</h2> )} 
      <ul className="breed-list">
        {currentBreeds.map((breed) => (
          <li  className="breed-item" key={breed.id}> 
           <div className="breed-name" ><Link to={`/petList/${breed.id}`}>{breed.breedName}</Link>  </div>
          <div  className="breed-info">
              <div className="breed-image"> <img src ={breed.imgSourceURL || defaultImage} alt="breed image"/> </div>        
               <div >
                    <div  className="breed-description">
                        {breed.breedDescription}
                    </div>
                </div>
          </div>         
          <div >
            <div  className="breed-stats">
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
        ))}
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



