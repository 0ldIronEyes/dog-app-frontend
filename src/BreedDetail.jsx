import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import CitySearchForm from './locationSearchForm.jsx';
import PetSearch from './PetSearch.jsx';
import "./style.css";
import defaultImage from './assets/dog_icon.png';

const BreedDetail = () => {
  const [breed, setBreed] = useState(null);
  const { id } = useParams(); 
  const [pets, setPets] = useState([]);
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(false); 

  useEffect(() => {
    const fetchBreedDetails = async () => {
      try {
        const response = await axios.get('https://dog-app-backend.onrender.com/api/id', {
            params: {id : id} 
        });
        setBreed(response.data[0]);
      } catch (error) {
        console.error('Error fetching breed details:', error);
      }
    };
    fetchBreedDetails();
  }, [id]);


  const handleLocSearch = async (loc) =>  {
    try {
      console.log('breed',breed.breedName);
      const response =await axios.get('https://dog-app-backend.onrender.com/api/find',
        {
          params: {
              breed: breed.breedName,
              location : loc
             }
        }
      );
      setPets(response.data.animals);
      setLocation(loc);
      setError(false); 
    } catch (error) {
      setError(true); 
      console.error('Error fetching pets:', error);
    }
  };


  if (!breed) {
    return <div>Loading...</div>;
  }

 
    return (  
        <>
          <div className='info-card'>
            <div className='breed-pic'> <img src ={breed.imgSourceURL || defaultImage} alt="breed image"/></div>
            <h1>{breed.breedName}</h1>
            <div>   
                <p>
                    {breed.breedType}
                </p>
                <p>
                   Origin:  {breed.origin}
                </p>
            </div>
            <div className='detail-description'>{breed.breedDescription} </div>
            <div className="detail-stats"> 
                <p> Lifespan: <br />up to {breed.maxLifeSpan} years</p> 
                <p> Maximum Weight:  <br />{breed.maxWeightPounds} pounds</p>
                <p> Maximum Height: <br /> {breed.maxHeightInches} inches</p>
            </div>
            <Link className="back-to-search" to={`/`}> Back to Search </Link>  
          </div>
            <div>
                <CitySearchForm onSubmit={handleLocSearch} />
            </div>
            
              {location && (
                <div>
                    <PetSearch pets={pets}  breedName= {breed.breedName} />
                </div>
              )}    
              {error && (
                <div>
                    <h1> No Pets Found</h1>
                </div>
              )}    
        </>   
    )
}

export default BreedDetail;