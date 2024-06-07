import DogBreedApi from "./api.js";

export async function signup(signupData, setToken) {
  try {
    let token = await DogBreedApi.signup(signupData);
    setToken(token);
    DogBreedApi.token = token;
    return { success: true };
  } catch (errors) {
    return { success: false, errors };
  }
}

export async function login(loginData, setToken) {
  try {
    let token = await DogBreedApi.login(loginData);
    setToken(token);
    DogBreedApi.token = token;
    return { success: true };
  } catch (errors) {
    return { success: false, errors };
  }
}


  /** Handles site-wide logout. */
  export function logout(setCurrentUser,setToken) {
    setCurrentUser(null);
    setToken(null);
  }

export function toggleFavorites(currentUser, favorites, setFavorites, favoriteBreed, life, height, weight) {
  if (favorites.has(favoriteBreed)) {
    DogBreedApi.removeFromFavorites(currentUser.username, favoriteBreed);
    setFavorites(new Set([...favorites].filter(breed => breed !== favoriteBreed)));
  } else {
    DogBreedApi.addToFavorites(currentUser.username, favoriteBreed, life, height, weight);
    setFavorites(new Set([...favorites, favoriteBreed]));
  }
}
