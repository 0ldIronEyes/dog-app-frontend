
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ProfileInfo from './ProfileInfo';
import UserContext from './UserContext';
import DogBreedApi from './api';
import LoadingSpinner from './LoadingSpinner';

jest.mock('axios');


jest.mock('./api');


jest.mock('./LoadingSpinner', () => () => <div data-testid="loading-spinner">Loading...</div>);

const renderWithContext = (ui, { providerProps, ...renderOptions }) => {
  return render(
    <BrowserRouter>
      <UserContext.Provider {...providerProps}>{ui}</UserContext.Provider>
    </BrowserRouter>,
    renderOptions
  );
};

describe('ProfileInfo', () => {
  const mockUser = {
    username: 'testuser',
    firstName: 'Test',
    lastName: 'User',
    email: 'testuser@example.com',
    userlocation: '12345',
  };

  const mockFavorites = new Set(['Breed1', 'Breed2']);

  const providerProps = {
    value: {
      currentUser: mockUser,
      favorites: mockFavorites,
      setFavorites: jest.fn(),
    }
  };

  beforeEach(() => {
    DogBreedApi.getDogBreed.mockReset();
    DogBreedApi.removeFromFavorites.mockReset();
  });

  test('show loading spinner initially', () => {
    renderWithContext(<ProfileInfo />, { providerProps });
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  test('show user info and favorite breeds after loading', async () => {
    const breedData = [
      { breedname: 'Breed1', lifespan: 10, weight: 50, height: 20 },
      { breedname: 'Breed2', lifespan: 12, weight: 55, height: 22 },
    ];

    DogBreedApi.getDogBreed.mockImplementation((breed) => {
      return breedData.find((b) => b.breedname === breed);
    });

    renderWithContext(<ProfileInfo />, { providerProps });

    await waitFor(() => expect(screen.getByText('Your Info')).toBeInTheDocument());

    expect(screen.getByText('testuser')).toBeInTheDocument();
    expect(screen.getByText('Test')).toBeInTheDocument();
    expect(screen.getByText('User')).toBeInTheDocument();
    expect(screen.getByText('testuser@example.com')).toBeInTheDocument();
    expect(screen.getByText('12345')).toBeInTheDocument();

    expect(screen.getByText('Breed1')).toBeInTheDocument();
    expect(screen.getByText('Breed2')).toBeInTheDocument();
  });

  test('removes breed from favorites', async () => {
    const breedData = [
      { breedname: 'Breed1', lifespan: 10, weight: 50, height: 20 },
      { breedname: 'Breed2', lifespan: 12, weight: 55, height: 22 },
    ];

    DogBreedApi.getDogBreed.mockImplementation((breed) => {
      return breedData.find((b) => b.breedname === breed);
    });

    renderWithContext(<ProfileInfo />, { providerProps });

    await waitFor(() => expect(screen.getByText('Breed1')).toBeInTheDocument());

    fireEvent.click(screen.getByText('Remove'));

    await waitFor(() => {
      expect(DogBreedApi.removeFromFavorites).toHaveBeenCalledWith(mockUser, 'Breed1');
      expect(providerProps.value.setFavorites).toHaveBeenCalled();
    });
  });

  test('navigates to breed details', async () => {
    const breedData = [
      { breedname: 'Breed1', lifespan: 10, weight: 50, height: 20 },
      { breedname: 'Breed2', lifespan: 12, weight: 55, height: 22 },
    ];

    DogBreedApi.getDogBreed.mockImplementation((breed) => {
      return breedData.find((b) => b.breedname === breed);
    });

    axios.get.mockResolvedValueOnce({ data: [{ id: '1', breedname: 'Breed1' }] });

    renderWithContext(<ProfileInfo />, { providerProps });

    await waitFor(() => expect(screen.getByText('Breed1')).toBeInTheDocument());

    fireEvent.click(screen.getByText('Breed1'));

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith('https://dog-app-backend.onrender.com/api/breeds', { params: { search: 'Breed1' } });
      expect(window.location.pathname).toBe('/petList/1');
    });
  });
});
