import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';

import MarcView from './MarcView';

const renderComponent = () => render(
  <MarcView />,
);

describe('Given MarcView', () => {
  it('should be rendered', () => {
    renderComponent();
    expect(screen.getByText('MarcView')).toBeVisible();
  });
});
