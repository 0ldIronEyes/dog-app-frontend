import React, { useContext, useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import { Link } from "react-router-dom";
import UserContext from "./UserContext.js";
import BreedSearchForm from "./BreedSearchForm.jsx";
import NumberSlider from './NumberSlider.jsx';
import DogBreedList from "./BreedList.jsx";
import axios from 'axios';
import './style.css';
import bannerimage from './assets/dog_bg.png';


/** Homepage of site.
 *
 * Shows welcome message or login/register buttons.
 *
 * Routed at /
 *
 * Routes -> Homepage
 */

function Homepage() {
  const { currentUser } = useContext(UserContext);
  console.debug("Homepage", "currentUser=", currentUser);
  const [dogBreeds, setDogBreeds] = useState([]);
  const [minLifeSpan, setMinLifeSpan] = useState(7);
  const [maxWeight, setMaxWeight] = useState(7);
  const [maxHeight, setMaxHeight] = useState(7);

  async function getByLifeSpan() {
    try {
      const response = await axios.get('http://localhost:5000/api/age', {
        params: {age : minLifeSpan} 
      });
      console.log(response.data);
      setDogBreeds(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

async function getbyMaxWeight() {
    try {
      const response = await axios.get('http://localhost:5000/api/weight', {
        params: {weightLimit : maxWeight} 
      });
      console.log(response.data);
      setDogBreeds(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  async function getbyMaxHeight() {
    try {
      const response = await axios.get('http://localhost:5000/api/height', {
        params: {heightLimit : maxHeight} 
      });
      console.log(response.data);
      setDogBreeds(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }


  return (
      <div className="Homepage">
        <div className="container text-center">
                <div>
                  <h1> Dog Breed Finder </h1>
                  <div className="banner" style={{backgroundImage: `url(${bannerimage})`}}></div>
                  <div className="content-container">
                  <div>
                  <Tabs className="Tabs">
                    <TabList className="TabList">
                       <Tab className="Tab"><h4> Search by Breed</h4></Tab>
                        <Tab className="Tab" > <h4>Search by Life Span</h4></Tab>
                        <Tab className="Tab"><h4>Search by Max Weight</h4></Tab>
                        <Tab className="Tab" ><h4>Search by Max Height </h4></Tab>
                    </TabList>
                    
                    <TabPanel className="TabPanel">
                       <BreedSearchForm setDogBreeds={setDogBreeds} />
                    </TabPanel>

                    <TabPanel className="TabPanel">
                       <NumberSlider title="Search by Life Span" Number={minLifeSpan} setNumber={setMinLifeSpan} getFunction={getByLifeSpan}/>
                  </TabPanel>
                  <TabPanel className="TabPanel">
                       <NumberSlider title="Search by maximum Weight" Number={maxWeight} setNumber={setMaxWeight} getFunction={getbyMaxWeight}/>
                  </TabPanel>
                  <TabPanel className="TabPanel" >
                       <NumberSlider title="Search by maximum Height" Number={maxHeight} setNumber={setMaxHeight} getFunction={getbyMaxHeight} />
                  </TabPanel>
                  </Tabs>
                  </div>
                  <div className="dogbreed-list">
                     <DogBreedList dogBreeds={dogBreeds} />
                  </div>
                  </div>
                </div>                 
        </div>
      </div>
  );
}

export default Homepage;
