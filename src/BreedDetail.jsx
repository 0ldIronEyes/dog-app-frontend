import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import DogBreedApi from './api.js';
import { useParams, Link, redirect } from 'react-router-dom';
import LocationSearchForm from './locationSearchForm.jsx';
import PetSearch from './PetSearch.jsx';
import UserContext from "./UserContext";
import "./style.css";
import defaultImage from './assets/dog_icon.png';


/** The breed detail page displays information and a discription about a dog breed. Below the description
 *  it renders a search field for entering a location to search for available dogs of tha breed. Users can also use
 * the zip code they've entered into their account to search their area instead of manually entering one. 
 */
const BreedDetail = () => {
  const { currentUser } = useContext(UserContext);
  const [breed, setBreed] = useState(null);
  const { id } = useParams(); 
  const [pets, setPets] = useState([]);
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(false); 

  //redirect to login if not signed in.
  if (!currentUser) 
    {
      redirect("/")
    }

  //Getting info about our breed by id, setting it to breed state variable
  useEffect(() => {
    
    const fetchBreedDetails = async () => {
      try{
        const response = await DogBreedApi.getByID(id);
        setBreed(response);
      } catch (error)
      {
       // console.error('Error fetching breed details:', error);
      }
    };
    fetchBreedDetails();
  }, [id]);


  //once submitted the search field will look for pets in the entered area. Otherwise return an error. this function is passed down to 
  //LocationSearchForm
  const handleLocSearch = async (loc) =>  {
    try {
       const result = await DogBreedApi.searchForPets(breed.breedName, loc);
       setPets(result.animals);
       setLocation(loc);
       setError(false); 
    } catch (error) {
      setError(true); 
     // console.error('Error fetching pets:', error);
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
                  <LocationSearchForm onSubmit={handleLocSearch} />
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