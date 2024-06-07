import React, { useContext, useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { useNavigate } from "react-router-dom";
import UserContext from "./UserContext.js";
import BreedSearchForm from "./BreedSearchForm.jsx";
import NumberSlider from './NumberSlider.jsx';
import DogBreedList from "./BreedList.jsx";
import HomeSignedOut from "./HomeSignedOut.jsx";
import Navigation from "./Navigation.jsx";
import DogBreedApi from "./api.js";
import './style.css';
import bannerimage from './assets/dog_bg.png';

/** Homepage of site.
 *
 * Shows welcome message or login/register buttons if not logged in.
 * Once logged in, displays tabs for user to search for dog breeds by, and displays returned dogs underneath it
 * Also diplays the navigation banner above the tabs for profile management.
 * Routed at /
 */

function Homepage() {
  const { currentUser } = useContext(UserContext);
 // console.debug("Homepage", "currentUser=", currentUser);
  const navigate = useNavigate();
  const [dogBreeds, setDogBreeds] = useState([]);
  const [minLifeSpan, setMinLifeSpan] = useState(7);
  const [maxWeight, setMaxWeight] = useState(7);
  const [maxHeight, setMaxHeight] = useState(7);
  const [selectedTab, setSelectedTab] = useState(0); 

  async function getByLifeSpan() {
    const dogs = await DogBreedApi.getByLifespan(minLifeSpan);
    setDogBreeds(dogs);
  }

  async function getbyMaxWeight() {
    const dogs = await DogBreedApi.getByWeight(maxWeight);
    setDogBreeds(dogs);
  }

  async function getbyMaxHeight() {
    const dogs = await DogBreedApi.getByHeight(maxHeight);
    setDogBreeds(dogs);
  }


  if (!currentUser) {
    return <HomeSignedOut />;
  }

  return (
    <div className="Homepage">
      <div className="container text-center">
        <div>
          <h1> Dog Breed Finder </h1>
          <div className="banner" style={{backgroundImage: `url(${bannerimage})`}}></div>
          <div className="content-container">
            <div>
              <Navigation />
              <Tabs className="Tabs">
                <TabList className="TabList">
                  <Tab className="Tab"><h4>Search by Life Span</h4></Tab>
                  <Tab className="Tab"><h4>Search by Max Weight</h4></Tab>
                  <Tab className="Tab"><h4>Search by Max Height</h4></Tab>
                  <Tab className="Tab"><h4> Search by Breed</h4></Tab>
                </TabList>
                <TabPanel className="TabPanel">
                  <NumberSlider title="Search by Life Span" Number={minLifeSpan} setNumber={setMinLifeSpan} getFunction={getByLifeSpan} />
                </TabPanel>
                <TabPanel className="TabPanel">
                  <NumberSlider title="Search by maximum Weight" Number={maxWeight} setNumber={setMaxWeight} getFunction={getbyMaxWeight} />
                </TabPanel>
                <TabPanel className="TabPanel">
                  <NumberSlider title="Search by maximum Height" Number={maxHeight} setNumber={setMaxHeight} getFunction={getbyMaxHeight} />
                </TabPanel>
                <TabPanel className="TabPanel">
                  <BreedSearchForm setDogBreeds={setDogBreeds} />
                </TabPanel>
              </Tabs>
            </div>
            <div className='dogbreed-list'>
              <DogBreedList dogBreeds={dogBreeds} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Homepage;
