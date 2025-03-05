import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import { fireEvent, render, screen } from '@folio/jest-config-stripes/testing-library/react';

import { MarcVersionHistory } from './MarcVersionHistory';
import { useMarcAuditDataQuery } from '../queries';

jest.mock('../queries', () => ({
  ...jest.requireActual('../queries'),
  useMarcAuditDataQuery: jest.fn().mockReturnValue({
    data: [{
      eventDate: '1970-01-01T00:00:00+00:00',
      action: 'UPDATED',
      diff: {
        modified: [
          {
            field: '999',
            newValue: 'ff $s new value',
            oldValue: 'ff $s old value',
          },
        ],
        added: [
          {
            field: '550',
            newValue: '$a new 550',
          },
        ],
        removed: [
          {
            field: '100',
            oldValue: '$a 100',
          },
        ],
      },
    }],
    totalRecords: 10,
    isLoading: false,
  }),
}));

const queryClient = new QueryClient();

const onCloseMock = jest.fn();
const marcId = 'marcId';

const renderMarcVersionHistory = () => render(
  <QueryClientProvider client={queryClient}>
    <MarcVersionHistory
      id={marcId}
      onClose={onCloseMock}
      marcType="bib"
    />
  </QueryClientProvider>,
);

describe('MarcVersionHistory', () => {
  const scrollIntoViewOriginal = Element.prototype.scrollIntoView;

  beforeAll(() => {
    Element.prototype.scrollIntoView = jest.fn();
  });

  afterAll(() => {
    Element.prototype.scrollIntoView = scrollIntoViewOriginal;
  });

  it('should render Version history pane', () => {
    renderMarcVersionHistory();

    expect(screen.getByText('stripes-components.versionHistory.pane.header')).toBeInTheDocument();
  });

  describe('when clicking on Load more button', () => {
    it('should make a new request with eventTs parameter', () => {
      renderMarcVersionHistory();

      useMarcAuditDataQuery.mockClear();
      fireEvent.click(screen.getByRole('button', { name: 'stripes-components.mcl.loadMore' }));

      const eventTs = 0; // timestamp of unix time

      expect(useMarcAuditDataQuery).toHaveBeenCalledWith(marcId, 'bib', eventTs);
    });
  });
});

