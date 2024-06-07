
import React from 'react';
import "./style.css";
import defaultImage from './assets/dog_icon.png';

const PetSearch = ({pets, breedName}) => {

  if (!pets)
  {
    return;
  }

 

  return (
  <>
    <div>
      <h3>{breedName} to adopt:</h3>
      {
        <ul className='pet-list'>
        {pets.map((pet) => (
          <li className="pet-entry" key={pet.id}>
            <div className='pet-pic'> <img src = {pet.photos.length > 0 ? pet.photos[0].medium : defaultImage} alt="breed image"/> </div>
            <div className="pet-info"> 
                <div className='pet-name'>  {pet.name} </div> 
                <div className='.pet-small-details '>    
                      <div> <span className="pet-gender">  {pet.gender} </span>  
                      <strong>|Age:</strong> {pet.age}<br />
                      </div>
                </div>
            
                <strong>Description:</strong> {pet.description} <br/>
                <strong>Contact:</strong> <a href= "mailto: {pet.contact.email}"> {pet.contact.email} </a>
            </div>           
          </li>
        ))}
      </ul>
      }
    </div>
  </>
  );
};

export default PetSearch;