// ProfileForm.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import ProfileForm from './ProfileForm';
import UserContext from './UserContext';
import DogBreedApi from './api';


jest.mock('./api');


jest.mock('./Alert', () => ({ type, messages }) => (
  <div data-testid={`alert-${type}`}>{messages.join(', ')}</div>
));

const renderWithContext = (ui, { providerProps, ...renderOptions }) => {
  return render(
    <BrowserRouter>
      <UserContext.Provider {...providerProps}>{ui}</UserContext.Provider>
    </BrowserRouter>,
    renderOptions
  );
};

describe('ProfileForm', () => {
  const mockUser = {
    username: 'testuser',
    firstName: 'Test',
    lastName: 'User',
    email: 'testuser@example.com',
    userlocation: '12345',
  };

  const providerProps = {
    value: {
      currentUser: mockUser,
      setCurrentUser: jest.fn(),
    }
  };

  beforeEach(() => {
    DogBreedApi.saveProfile.mockReset();
  });

  test('ProfileForm component', () => {
    renderWithContext(<ProfileForm />, { providerProps });

    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test')).toBeInTheDocument();
    expect(screen.getByDisplayValue('User')).toBeInTheDocument();
    expect(screen.getByDisplayValue('testuser@example.com')).toBeInTheDocument();
    expect(screen.getByDisplayValue('12345')).toBeInTheDocument();
  });

  test('handles form', async () => {
    DogBreedApi.saveProfile.mockResolvedValueOnce({ ...mockUser, firstName: 'Updated' });

    renderWithContext(<ProfileForm />, { providerProps });

    fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'Updated' } });
    fireEvent.change(screen.getByLabelText(/confirm password to make changes:/i), { target: { value: 'password' } });
    fireEvent.click(screen.getByText(/save changes/i));

    await waitFor(() => expect(DogBreedApi.saveProfile).toHaveBeenCalledWith('testuser', {
      firstName: 'Updated',
      lastName: 'User',
      email: 'testuser@example.com',
      userlocation: '12345',
      password: 'password'
    }));

    await waitFor(() => expect(screen.getByTestId('alert-success')).toBeInTheDocument());
    expect(screen.getByTestId('alert-success')).toHaveTextContent('Updated successfully.');
  });

  test('form submission with errors', async () => {
    const errorMessages = ['Invalid email address', 'Password is required'];
    DogBreedApi.saveProfile.mockRejectedValueOnce(errorMessages);

    renderWithContext(<ProfileForm />, { providerProps });

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'invalid-email' } });
    fireEvent.change(screen.getByLabelText(/confirm password to make changes:/i), { target: { value: '' } });
    fireEvent.click(screen.getByText(/save changes/i));

    await waitFor(() => expect(DogBreedApi.saveProfile).toHaveBeenCalledWith('testuser', {
      firstName: 'Test',
      lastName: 'User',
      email: 'invalid-email',
      userlocation: '12345',
      password: ''
    }));

    await waitFor(() => expect(screen.getByTestId('alert-danger')).toBeInTheDocument());
    expect(screen.getByTestId('alert-danger')).toHaveTextContent('Invalid email address, Password is required');
  });

});
