import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react';
import axios from 'axios';
import { MemoryRouter, Route } from 'react-router-dom';
import BreedDetail from './BreedDetail';

jest.mock('axios');

describe('BreedDetail component', () => {
  const mockBreed = {
    breedName: 'Labrador Retriever',
    breedType: 'Retriever',
    origin: 'Canada',
    breedDescription: 'Friendly and outgoing',
    maxLifeSpan: 12,
    maxWeightPounds: 80,
    maxHeightInches: 24,
    imgSourceURL: 'labrador.jpg',
  };

  it('renders loading text while fetching breed details', async () => {
    axios.get.mockResolvedValueOnce({ data: [mockBreed] });
    const { getByText } = render(<BreedDetail />, { wrapper: MemoryRouter });

    expect(getByText('Loading...')).toBeInTheDocument();

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith('http://localhost:5000/api/id', {
        params: { id: undefined },
      });
    });
  });

  it('renders breed details after fetching', async () => {
    axios.get.mockResolvedValueOnce({ data: [mockBreed] });
    const { getByText, getByAltText } = render(
      <MemoryRouter initialEntries={['/breed/1']}>
        <Route path="/breed/:id">
          <BreedDetail />
        </Route>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(getByText('Labrador Retriever')).toBeInTheDocument();
      expect(getByAltText('breed image')).toHaveAttribute('src', 'labrador.jpg');
    });
  });

  it('fetches pets on location search', async () => {
    axios.get.mockResolvedValueOnce({ data: { animals: [{ name: 'Buddy' }] } });
    const { getByTestId, getByText } = render(<BreedDetail />, { wrapper: MemoryRouter });

    fireEvent.change(getByTestId('location-input'), { target: { value: 'New York' } });
    fireEvent.click(getByText('Search'));

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith('http://localhost:5000/api/find', {
        params: { breed: 'Labrador Retriever', location: 'New York' },
      });
      expect(getByText('Buddy')).toBeInTheDocument();
    });
  });

  it('handles errors during fetch', async () => {
    axios.get.mockRejectedValueOnce(new Error('Failed to fetch'));
    const { getByText } = render(<BreedDetail />, { wrapper: MemoryRouter });

    await waitFor(() => {
      expect(getByText('Loading...')).toBeInTheDocument();
    });
    expect(getByText('Error fetching breed details: Failed to fetch')).toBeInTheDocument();
  });
});