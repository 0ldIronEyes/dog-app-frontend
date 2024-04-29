import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import Homepage from './Homepage';

jest.mock('axios');

describe('Homepage component', () => {
  it('renders welcome message when currentUser is present', () => {
    const currentUser = { firstName: 'John' };
    const { getByText } = render(<Homepage />, {
      currentUser,
    });
    const welcomeMessage = getByText('Welcome Back, John!');
    expect(welcomeMessage).toBeInTheDocument();
  });

  it('renders login/register buttons when currentUser is not present', () => {
    const { getByText } = render(<Homepage />);
    const loginButton = getByText('Dog Breed Finder');
    expect(loginButton).toBeInTheDocument();
  });

  it('fetches data by life span on button click', async () => {
    axios.get.mockResolvedValueOnce({ data: ['Golden Retriever', 'Labrador'] });
    const { getByText } = render(<Homepage />);

    fireEvent.click(getByText('Search by Life Span'));

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith('http://localhost:5000/api/age', {
        params: { age: 7 },
      });
    });
  });

  it('fetches data by max weight on button click', async () => {
    axios.get.mockResolvedValueOnce({ data: ['Husky', 'German Shepherd'] });
    const { getByText } = render(<Homepage />);

    fireEvent.click(getByText('Search by maximum Weight'));

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith('http://localhost:5000/api/weight', {
        params: { weightLimit: 7 },
      });
    });
  });

  it('fetches data by max height on button click', async () => {
    axios.get.mockResolvedValueOnce({ data: ['Dachshund', 'Corgi'] });
    const { getByText } = render(<Homepage />);

    fireEvent.click(getByText('Search by maximum Height'));

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith('http://localhost:5000/api/height', {
        params: { heightLimit: 7 },
      });
    });
  });
});