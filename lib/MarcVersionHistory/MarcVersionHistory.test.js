import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';
import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import { MarcVersionHistory } from './MarcVersionHistory';

jest.mock('../queries', () => ({
  ...jest.requireActual('../queries'),
  useMarcAuditDataQuery: () => jest.fn(),
}));

const queryClient = new QueryClient();

const onCloseMock = jest.fn();
const marcId = 'marcId';

const renderMarcVersionHistory = () => render(
  <QueryClientProvider client={queryClient}>
    <MarcVersionHistory
      id={marcId}
      onClose={onCloseMock}
    />
  </QueryClientProvider>,
);

describe('MarcVersionHistory', () => {
  it('should render Version history pane', () => {
    renderMarcVersionHistory();

    expect(screen.getByText('stripes-components.versionHistory.pane.header')).toBeInTheDocument();
  });
});

