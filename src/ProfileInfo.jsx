import React, { useState, useContext, useEffect, redirect} from "react";
import Alert from "./Alert";
import UserContext from "./UserContext";
import { Link, useNavigate } from "react-router-dom";
import "./profileform.css";
import DogBreedApi from "./api";
import LoadingSpinner from "./LoadingSpinner";

//Displays profile info as well as a list of breeds user has favorited.
function ProfileInfo() {
  const navigate = useNavigate();
  const { currentUser, favorites, setFavorites } = useContext(UserContext);
  const [loaded, setLoaded] = useState(false);
  const [breedInfo, setBreedInfo] = useState([]);


  if (!currentUser)
  {
      redirect("/");
  }

  //get list of dog breed favorites
  useEffect(() => {
    const getFavorites = async () => {
      try {
          const breeds = [];
          for (const b of favorites) {
            let breed = await DogBreedApi.getDogBreed(b);
            breeds.push(breed);
          }
          setBreedInfo(breeds);
      } catch (error) {
          console.error('Error fetching breed details:', error);
      }
      setLoaded(true);
    };
    setLoaded(false);
    getFavorites();
  }, [favorites]
 );


 //remove from list of favorites
const removeFromFavorites = async(breedName) =>
{
  try{
    await DogBreedApi.removeFromFavorites(currentUser.username, breedName);
    setFavorites((prevFavorites) => {
      const newFavorites = new Set(prevFavorites);
      newFavorites.delete(breedName);
      return newFavorites;
    });
    setBreedInfo((prevBreedInfo) => prevBreedInfo.filter(breed => breed.name != breedName));
    }
    catch (error)
    {
      console.error('Error removing breed from favorites:', error);
    }
  }


  //go to details page of clicked dog breed
 async function goToDetails(name) {
    try{
      const response = await DogBreedApi.getByName(name);
      navigate(`/petList/${response[0].id}`);
    }catch(error)
    {
      console.error('Error fetching data:', error);
    }
};


 if (!loaded)
  {
    return <LoadingSpinner />;
  }

  console.log(breedInfo);
  return (
    <div>
        <div className="user-info">
        <h1>Your Info</h1>
          <div className="info">
              <p><span className="label">Username:</span> {currentUser.username}</p>
              <p><span className="label">First Name:</span> {currentUser.firstName} </p>
              <p><span className="label">Last Name:</span> {currentUser.lastName} </p>
              <p><span className="label">Email:</span> {currentUser.email} </p>
              <p><span className="label">Location (Zip Code):</span> {currentUser.userlocation}</p>
          </div>
          <div className="back-button"><Link to={`/`}> Back to Search </Link>  </div>
        </div>

        <div>
          <div> <h3>Dog Breeds You've favorited </h3></div>
          <div className="user-info">
          <ul className="breed-list">
          {breedInfo.map((breed, idx) => (
              <li key={idx}>
                 <div className="breed-item">
                    <div className ="breed-titlediv"> <h4 className="breed-name" onClick= {() => goToDetails(breed.breedname)}>{breed.breedname}</h4>  </div>
                    <div  className="breed-stats">
                          <div>
                              <strong>lifetime:</strong> <br /> {breed.lifespan} lbs
                          </div>
                          <div >
                              <strong>Weight:</strong> <br /> {breed.weight} lbs
                          </div>
                          <div >
                              <strong>Height:</strong> <br /> {breed.height} lbs
                          </div>    
                        <button onClick={() => removeFromFavorites(breed.breedname)}>Remove</button>      
                    </div>               
                  </div>       
              </li>
            ))}
          </ul>
          </div>
        </div>
      </div>
      );
}

export default ProfileInfo;
