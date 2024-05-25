// Homepage.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Homepage from './Homepage';
import UserContext from './UserContext';
import axios from 'axios';
import { BrowserRouter } from 'react-router-dom';


jest.mock('axios');


jest.mock('./HomeSignedOut', () => () => <div>HomeSignedOut</div>);
jest.mock('./Navigation', () => () => <div>Navigation</div>);
jest.mock('./BreedSearchForm', () => ({ setDogBreeds }) => (
  <div>
    <input type="text" placeholder="Search by Breed" />
    <button onClick={() => setDogBreeds([{ name: 'corgi' }])}>Search</button>
  </div>
));
jest.mock('./NumberSlider', () => ({ title, Number, setNumber, getFunction }) => (
  <div>
    <h4>{title}</h4>
    <input
      type="range"
      min="1" max="20"
      value={Number}
      onChange={(e) => setNumber(Number(e.target.value))}
    />
    <button onClick={getFunction}>Search</button>
  </div>
));

const mockUser = { username: 'testuser', breeds: [] };

const renderWithContext = (ui, { providerProps, ...renderOptions }) => {
  return render(
    <BrowserRouter>
      <UserContext.Provider {...providerProps}>{ui}</UserContext.Provider>
    </BrowserRouter>,
    renderOptions
  );
};

describe('Homepage', () => {
  const providerProps = {
    value: {
      currentUser: mockUser,
      setCurrentUser: jest.fn(),
      favorites: new Set(),
      setFavorites: jest.fn(),
      toggleFavorites: jest.fn(),
      signup: jest.fn(),
      login: jest.fn(),
      logout: jest.fn(),
    }
  };

  test('can switch tabs and perform search', async () => {
    axios.get.mockResolvedValue({ data: [{ name: 'corgi' }] });

    renderWithContext(<Homepage />, { providerProps });

    fireEvent.click(screen.getByText('Search by Life Span'));
    fireEvent.change(screen.getByRole('slider', { name: 'Search by Life Span' }), { target: { value: 10 } });
    fireEvent.click(screen.getByRole('button', { name: 'Search' }));

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith('https://dog-app-backend.onrender.com/api/age', { params: { age: 10 } });
      expect(screen.getByText('corgi')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Search by Max Weight'));
    fireEvent.change(screen.getByRole('slider', { name: 'Search by maximum Weight' }), { target: { value: 20 } });
    fireEvent.click(screen.getByRole('button', { name: 'Search' }));

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith('https://dog-app-backend.onrender.com/api/weight', { params: { weightLimit: 20 } });
      expect(screen.getByText('corgi')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Search by Max Height'));
    fireEvent.change(screen.getByRole('slider', { name: 'Search by maximum Height' }), { target: { value: 15 } });
    fireEvent.click(screen.getByRole('button', { name: 'Search' }));

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith('https://dog-app-backend.onrender.com/api/height', { params: { heightLimit: 15 } });
      expect(screen.getByText('corgi')).toBeInTheDocument();
    });
  });
});
