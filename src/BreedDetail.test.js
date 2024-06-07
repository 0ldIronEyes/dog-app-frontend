// BreedDetail.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import BreedDetail from './BreedDetail';
import UserContext from './UserContext';

// Mock axios
jest.mock('axios');

jest.mock('./locationSearchForm.js', () => ({ onSubmit }) => (
  <div>
    <input type="text" placeholder="Enter location" />
    <button onClick={() => onSubmit('test-location')}>Search</button>
  </div>
));
jest.mock('./PetSearch.js', () => ({ pets, breedName }) => (
  <div>
    {pets.length > 0 ? (
      pets.map((pet, index) => <div key={index}>{pet.name}</div>)
    ) : (
      <div>No pets found</div>
    )}
  </div>
));

const renderWithContext = (ui, { providerProps, ...renderOptions }) => {
  return render(
    <BrowserRouter>
      <UserContext.Provider {...providerProps}>{ui}</UserContext.Provider>
    </BrowserRouter>,
    renderOptions
  );
};

describe('BreedDetail', () => {
  const providerProps = {
    value: {
      currentUser: { username: 'testuser' },
      setCurrentUser: jest.fn(),
      favorites: new Set(),
      setFavorites: jest.fn(),
      toggleFavorites: jest.fn(),
      signup: jest.fn(),
      login: jest.fn(),
      logout: jest.fn(),
    }
  };

  beforeEach(() => {
    axios.get.mockReset();
  });

  test('renders loading initially', () => {
    axios.get.mockResolvedValueOnce({ data: [] });
    renderWithContext(
      <Routes>
        <Route path="/breed/:id" element={<BreedDetail />} />
      </Routes>,
      { providerProps, route: '/breed/1' }
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('renders breed details after fetching data', async () => {
    const breedData = [
      {
        breedName: 'Test Breed',
        breedType: 'Test Type',
        origin: 'Test Origin',
        breedDescription: 'Test Description',
        maxLifeSpan: 12,
        maxWeightPounds: 50,
        maxHeightInches: 24,
        imgSourceURL: 'test-image-url'
      }
    ];
    
    axios.get.mockResolvedValueOnce({ data: breedData });

    renderWithContext(
      <Routes>
        <Route path="/breed/:id" element={<BreedDetail />} />
      </Routes>,
      { providerProps, route: '/breed/1' }
    );

    await waitFor(() => expect(screen.getByText('Test Breed')).toBeInTheDocument());
    expect(screen.getByText('Test Type')).toBeInTheDocument();
    expect(screen.getByText('Origin:  Test Origin')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText('up to 12 years')).toBeInTheDocument();
    expect(screen.getByText('50 pounds')).toBeInTheDocument();
    expect(screen.getByText('24 inches')).toBeInTheDocument();
  });

  test('handles location search and displays pets', async () => {
    const breedData = [
      {
        breedName: 'Test Breed',
        breedType: 'Test Type',
        origin: 'Test Origin',
        breedDescription: 'Test Description',
        maxLifeSpan: 12,
        maxWeightPounds: 50,
        maxHeightInches: 24,
        imgSourceURL: 'test-image-url'
      }
    ];
    const petData = {
      animals: [{ name: 'Test Pet' }]
    };
    
    axios.get
      .mockResolvedValueOnce({ data: breedData })
      .mockResolvedValueOnce({ data: petData });

    renderWithContext(
      <Routes>
        <Route path="/breed/:id" element={<BreedDetail />} />
      </Routes>,
      { providerProps, route: '/breed/1' }
    );

    await waitFor(() => expect(screen.getByText('Test Breed')).toBeInTheDocument());

    fireEvent.click(screen.getByText('Search'));

    await waitFor(() => expect(screen.getByText('Test Pet')).toBeInTheDocument());
  });

  test('displays error message when no pets found', async () => {
    const breedData = [
      {
        breedName: 'Test Breed',
        breedType: 'Test Type',
        origin: 'Test Origin',
        breedDescription: 'Test Description',
        maxLifeSpan: 12,
        maxWeightPounds: 50,
        maxHeightInches: 24,
        imgSourceURL: 'test-image-url'
      }
    ];

    axios.get
      .mockResolvedValueOnce({ data: breedData })
      .mockRejectedValueOnce(new Error('No pets found'));

    renderWithContext(
      <Routes>
        <Route path="/breed/:id" element={<BreedDetail />} />
      </Routes>,
      { providerProps, route: '/breed/1' }
    );

    await waitFor(() => expect(screen.getByText('Test Breed')).toBeInTheDocument());

    fireEvent.click(screen.getByText('Search'));

    await waitFor(() => expect(screen.getByText('No pets found')).toBeInTheDocument());
  });
});
