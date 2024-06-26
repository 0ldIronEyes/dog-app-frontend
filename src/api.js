
import axios from "axios";

//const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3001";
const BASE_URL = "https://dog-app-backend.onrender.com";

const API_KEY = 'FyGKpuRKqsV5w5M8A3VzaeuL51yB05eIuNKByVDsM526hPD99X';
const secret = 'kkmUznOGbMAyVPOeoTmgTDJqllXi43MWEPNg3Mvl';

class DogBreedApi {
  // the token for interactive with the API will be stored here.
  static token;

  static async request(endpoint, data = {}, method = "get") {
    //console.debug("API Call:", endpoint, data, method);

    const url = `${BASE_URL}/${endpoint}`;
    const headers = { Authorization: `Bearer ${DogBreedApi.token}` };
    const params = (method === "get")
        ? data
        : {};

    try {
      const response = await axios({ url, method, data, params, headers });
      return response.data;
    } catch (err) {
      console.error("API Error:", err.response);
      let message;

      // Check if response is HTML
      if (err.response && err.response.data && typeof err.response.data === 'string' && err.response.data.startsWith('<!DOCTYPE html>')) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(err.response.data, 'text/html');
        const pre = doc.querySelector('pre');
        if (pre) {
          const text = pre.textContent;
          const cutoffIndex = text.indexOf('at ');
          message = cutoffIndex === -1 ? text : text.substring(0, cutoffIndex).trim();
        } else {
          message = 'An unknown error occurred';
        }
      } else {
        message = err.response.data.error ? err.response.data.error.message : 'An unknown error occurred';
      }

      throw Array.isArray(message) ? message : [message];
    }
  }

  // Individual API routes

  /** Get the current user. */

  static async getCurrentUser(username) {
    let res = await this.request(`users/${username}`);
    return res.user;
  }



  /** Get token for login from username, password. */

  static async login(data) {
    let res = await this.request(`users/token`, data, "post");
    return res.token;
  }

  /** Signup for site. */

  static async signup(data) {
    let res = await this.request(`users/register`, data, "post");
    return res.token;
  }

  /** Save user profile page. */

  static async saveProfile(username, data) {
    let res = await this.request(`users/${username}`, data, "patch");
    return res.user;
  }

  /** Add a dog breed to a user's profile to be displayed as a favorite */
  static async addToFavorites(username, breedname, life, height, weight)
  {
    let res = await axios.post(`${BASE_URL}/users/${username}/favorites/add/${breedname}`, null,
     { params: { life: life, height: height, weight: weight} }
    );
    return res.data.favorited;
  }


  /** Add a dog breed to a user's profile to be displayed as a favorite */
  static async removeFromFavorites(username, breedname)
  {
    let res = await axios.post(`${BASE_URL}/users/${username}/favorites/remove/${breedname}`,
    );
    return res.favorited;
  }


  /** Get dog breed info stored in server database */
  static async getDogBreed(breed) {
    let res = await axios.get(`${BASE_URL}/breeds/get/${breed}`);
    return res.data.breedinfo;
  }

  

  
  /** query dogbreeddbapi to filter based on height */
  static async getByHeight(height)
  {
    try{
      const response = await axios.get(`${BASE_URL}/breeds/height`, {
        params: {heightLimit : height} 
      });
      return response.data;
    }
    catch(error)
    {
      console.error('Error fetching data:', error);
      return null;
    }
  }

  /** query dogbreeddbapi to filter based on weight */
  static async getByWeight(weight){
    try{
      const response = await axios.get(`${BASE_URL}/breeds/weight`, {
        params: {weightLimit : weight} 
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }


    /** query dogbreeddbapi to filter based on lifewpan */
  static async getByLifespan(life)
  {
    try{
      const response = await axios.get(`${BASE_URL}/breeds/age`, {
        params: {age : life} 
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching data:', error);
      return null;
    }
  }


    /** query dogbreeddbapi to filter based on name */
    static async getByName(name)
    {
      try {
        const response = await axios.get(`${BASE_URL}/breeds/names`, {
            params: {search: name} 
          });
       return response.data;
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

  /** query dogbreeddbapi to get a specific dog's information by id*/
  static async getByID(id)
  {
      try {
        const response = await axios.get(`${BASE_URL}/breeds/id`, {
            params: {id : id} 
        });
        return response.data[0];
      } catch (error) {
        console.error('Error fetching breed details:', error);
      }
  }

  /** query petfinder api for available pets based on name of breed and zip code to search in */
  static async searchForPets(breed, location)
  {
    try {
      const response = await axios.get(`${BASE_URL}/breeds/find`,
      {
        params: {
          breed: breed,
          location : location
         }
      });
      return response.data;
    } catch(error)
    {
      console.error('Cant find pets of breed:', error);
    }
  }
  
}

export default DogBreedApi;

