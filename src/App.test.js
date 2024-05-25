
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App, { TOKEN_STORAGE_ID } from './App.jsx';
import DogBreedApi from './api';
import UserContext from './UserContext';


jest.mock('./api');


jest.mock('./useLocalStorage', () => {
  return function() {
    return [null, jest.fn()];
  };
});


function renderWithContext(ui, { providerProps, ...renderOptions }) {
  return render(
    <BrowserRouter>
      <UserContext.Provider {...providerProps}>{ui}</UserContext.Provider>
    </BrowserRouter>,
    renderOptions
  );
}

describe('App', () => {
  const providerProps = {
    value: {
      currentUser: null,
      setCurrentUser: jest.fn(),
      favorites: new Set(),
      setFavorites: jest.fn(),
      toggleFavorites: jest.fn(),
      signup: jest.fn(),
      login: jest.fn(),
      logout: jest.fn(),
    }
  };

  test('should have loading spinner initially', () => {
    renderWithContext(<App />, { providerProps });

    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  test('handles login', async () => {

    const loginData = { username: 'testuser', password: 'password' };
    const token = 'fake-token';
    

    DogBreedApi.login.mockResolvedValueOnce(token);
    DogBreedApi.getCurrentUser.mockResolvedValueOnce({
    username: 'testuser',
      breeds: []
    });

    renderWithContext(<App />,  { providerProps }  );

    const loginButton = screen.getByRole('button', { name: /login/i });
    
    fireEvent.click(loginButton);

    await waitFor(() => {

      expect(DogBreedApi.login).toHaveBeenCalledWith(loginData);
      expect(localStorage.setItem).toHaveBeenCalledWith(TOKEN_STORAGE_ID, token);
   
    });
  });

  test('handles signup', async () => {
    const signupData = { username: 'newuser', password: 'password' };
    const token = 'fake-token';

    DogBreedApi.signup.mockResolvedValueOnce(token);
    DogBreedApi.getCurrentUser.mockResolvedValueOnce({
      username: 'newuser',
      breeds: []
    });

    renderWithContext(<App />, { providerProps });

    const signupButton = screen.getByRole('button', { name: /signup/i });
    fireEvent.click(signupButton);

    await waitFor(() => {
      expect(DogBreedApi.signup).toHaveBeenCalledWith(signupData);
      expect(localStorage.setItem).toHaveBeenCalledWith(TOKEN_STORAGE_ID, token);
    });
  });
});
