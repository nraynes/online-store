/* eslint-disable no-undef */
/* eslint-disable react/react-in-jsx-scope */
import { render, screen, waitFor } from '@testing-library/react';
import AppProvider from '@/providers/AppProvider';
import LaunchPad from '@/features/common/components/LaunchPad';

const TestComponent = () => (
  <AppProvider>
    <LaunchPad />
  </AppProvider>
);

describe('Launch Pad Component Tests', () => {

  test('Should render component.', async () => {
    render(<TestComponent />);
    await waitFor(() => {
      const element = screen.getByTestId('launch-pad-background');
      expect(element).toBeInTheDocument();
    });
  });

  test('Should have a button to go to the catalog.', async () => {
    render(<TestComponent />);
    await waitFor(() => {
      const element = screen.getByTestId('launch-pad-button');
      expect(element).toBeInTheDocument();
    });
  });

});