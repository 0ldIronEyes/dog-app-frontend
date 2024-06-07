import React, { useContext, useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import LoginForm from "./LoginForm.js";
import SignupForm from "./SignupForm.js";
import Navigation from "./Navigation.js";
import './style.css';
import bannerimage from './assets/dog_bg.png';



/** Homepage of site when not logged in.
 *
 * 
 *Called from Homepage
 * 
 */

function HomeSignedOut() {
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
                            <Tab className="Tab"><h4> Log In</h4></Tab>
                            <Tab className="Tab" > <h4>Sign Up</h4></Tab>
                            
                        </TabList>

                        <TabPanel className="TabPanel">
                          <LoginForm/>
                      </TabPanel>

                      <TabPanel className="TabPanel" >
                          <SignupForm />
                      </TabPanel>
                      </Tabs>
                      </div>
                  </div>
                </div>                 
        </div>
      </div>
  );
}

export default HomeSignedOut;
