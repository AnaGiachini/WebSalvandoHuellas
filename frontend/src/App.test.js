import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock('./services/authService', () => ({
  __esModule: true,
  default: {
    login: jest.fn(),
    register: jest.fn(),
    forgotPassword: jest.fn(),
    resetPassword: jest.fn(),
  },
}));

jest.mock('./services/animalsService', () => ({
  __esModule: true,
  default: {
    getByStatus: jest.fn(() => Promise.resolve([])),
  },
}));

jest.mock('./services/articlesService', () => ({
  __esModule: true,
  default: {
    getAll: jest.fn(() => Promise.resolve([])),
  },
}));

jest.mock('./services/eventsService', () => ({
  __esModule: true,
  getEvents: jest.fn(() => Promise.resolve([])),
}));

jest.mock('./components/FeaturedAnimals', () => () => (
  <div data-testid="featured-animals" />
));

jest.mock('./components/FeaturedProducts', () => () => (
  <div data-testid="featured-products" />
));

jest.mock('./components/UpcomingEvents', () => () => (
  <div data-testid="upcoming-events" />
));

test('renders the Salvando Huellas home page', () => {
  render(<App />);
  expect(
    screen.getByRole('heading', { level: 1, name: /salvando huellas/i })
  ).toBeInTheDocument();
});
