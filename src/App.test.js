import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', async () => {
  render(<App />);
  // Use await to wait for the component to render and the text to become available
  const linkElement = await screen.findByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
