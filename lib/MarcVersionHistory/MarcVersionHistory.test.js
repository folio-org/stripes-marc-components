import { useStripes } from '@folio/stripes/core';
import {
  fireEvent,
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';

import { MarcVersionHistory } from './MarcVersionHistory';
import { useMarcAuditDataQuery } from '../queries';
import buildStripes from '../../test/jest/__mock__/stripesCore.mock';
import Harness from '../../test/jest/helpers/harness';

const mockHasPerm = jest.fn().mockReturnValue(true);

useStripes.mockReturnValue(buildStripes({
  hasPerm: mockHasPerm,
}));

jest.mock('../queries', () => ({
  ...jest.requireActual('../queries'),
  useMarcAuditDataQuery: jest.fn().mockReturnValue({
    data: [{
      eventDate: '1970-01-01T00:00:00+00:00',
      action: 'UPDATED',
      eventTs: 1741264744302,
      userId: 'user-id',
      diff: {
        collectionChanges: [{
          'collectionName': '750',
          'itemChanges': [
            {
              'changeType': 'REMOVED',
              'oldValue': ' 0 $a Black people $0 (DLC)sh 85014672 ',
              'newValue': null,
            },
            {
              'changeType': 'ADDED',
              'oldValue': null,
              'newValue': ' 0 $a Black people $0 (DLC)sh 85014672',
            },
          ],
        }],
        fieldChanges: [
          {
            'changeType': 'MODIFIED',
            'fieldName': '150',
            'fullPath': '150',
            'oldValue': '   $a foo',
            'newValue': '   $a foo test',
          },
          {
            'changeType': 'MODIFIED',
            'fieldName': '003',
            'fullPath': '003',
            'oldValue': 'OCoLC',
            'newValue': '$a OCoLC',
          },
          {
            'changeType': 'MODIFIED',
            'fieldName': 'LDR',
            'fullPath': 'LDR',
            'oldValue': '123  4500',
            'newValue': '1234',
          },
        ],
      },
    }],
    totalRecords: 10,
    isLoading: false,
  }),
}));

const onCloseMock = jest.fn();
const marcId = 'marcId';

const renderMarcVersionHistory = () => render(
  <Harness>
    <MarcVersionHistory
      id={marcId}
      onClose={onCloseMock}
      marcType="bib"
    />
  </Harness>,
);

describe('MarcVersionHistory', () => {
  const scrollIntoViewOriginal = Element.prototype.scrollIntoView;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  beforeAll(() => {
    Element.prototype.scrollIntoView = jest.fn();
  });

  afterAll(() => {
    Element.prototype.scrollIntoView = scrollIntoViewOriginal;
  });

  it('should render Version history pane', () => {
    renderMarcVersionHistory();

    expect(screen.getByText('stripes-components.auditLog.pane.header')).toBeInTheDocument();
  });

  describe('when clicking on Load more button', () => {
    it('should make a new request with eventTs parameter', () => {
      renderMarcVersionHistory();

      useMarcAuditDataQuery.mockClear();
      fireEvent.click(screen.getByRole('button', { name: 'stripes-components.mcl.loadMore' }));

      const eventTs = 1741264744302; // timestamp of unix time

      expect(useMarcAuditDataQuery).toHaveBeenCalledWith(marcId, 'bib', eventTs);
    });
  });

  describe('when there is a user view permission', () => {
    it('should display username as a link', () => {
      renderMarcVersionHistory();

      expect(screen.getByRole('link', { name: 'lastName, firstName' })).toBeInTheDocument();
    });
  });

  describe('when there is no a user view permission', () => {
    it('should display username as not a link', () => {
      mockHasPerm.mockReturnValue(false);

      renderMarcVersionHistory();

      expect(screen.queryByRole('link', { name: 'lastName, firstName' })).toBeNull();
      expect(screen.getByText('lastName, firstName')).toBeInTheDocument();
    });
  });
});

