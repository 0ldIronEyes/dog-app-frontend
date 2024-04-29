import React, {useState } from 'react';
import "./style.css";

const PetList = ({ pets }) => {
 

 
  if (pets.length < 1)
    return;
  
    return (
    <div>
      <h2 className='breeds-display'>Available dogs: </h2>
      <ul className='breed-entry'>
        {pets.animals.map((pet) => (
          <li key={pet.id}>
           <img src={pet.photos.small}></img>
           {pet.name}
           <div> {pet.gender}</div>
           <div> {pet.age}</div>
           <div> {pet.contact.email}</div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default PetList;
