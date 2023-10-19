import { render, screen } from '@testing-library/react';
import App from './App';
import { act } from 'react-dom/test-utils';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  act(() => {  // Wrap state updates inside act
    expect(linkElement).toBeInTheDocument();
  });
});
