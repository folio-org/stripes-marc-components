import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import {
  useStripes,
  useOkapiKy,
} from '@folio/stripes/core';
import { useUsersBatch } from '@folio/stripes-acq-components';

import { MarcVersionHistory } from './MarcVersionHistory';

import buildStripes from '../../test/jest/__mock__/stripesCore.mock';
import Harness from '../../test/jest/helpers/harness';

const mockHasPerm = jest.fn().mockReturnValue(true);
const totalRecords = 3;

const auditDataResponse = {
  marcAuditItems: [{
    'eventId': '3662b23d-f69a-4992-b116-3f50248f8fe7',
    'entityId': '4027355e-9095-5577-8b5d-c7bffe9d3597',
    'eventDate': '2026-04-01T15:52:04.004+00:00',
    'eventTs': 1775058724004,
    'origin': 'mod-source-record-storage-5.10.15',
    'action': 'UPDATED',
    'userId': 'user-id',
    'diff': {
      'fieldChanges': [{
        'changeType': 'MODIFIED',
        'fieldName': '100',
        'fullPath': '100',
        'oldValue': '1  $a Freeman, Carroll edit 10',
        'newValue': '1  $a Freeman, Carroll edit 11',
      }],
      'collectionChanges': [],
    },
  }],
  totalRecords,
};

const auditDataResponseWithNextPage = {
  marcAuditItems: [{
    'eventId': '60e38210-70f7-48b2-8a99-c24af9ad9331',
    'entityId': '4027355e-9095-5577-8b5d-c7bffe9d3597',
    'eventDate': '2026-04-01T15:51:57.741+00:00',
    'eventTs': 1775058717741,
    'origin': 'mod-source-record-storage-5.10.15',
    'action': 'UPDATED',
    'userId': 'user-id',
    'diff': {
      'fieldChanges': [{
        'changeType': 'MODIFIED',
        'fieldName': '100',
        'fullPath': '100',
        'oldValue': '1  $a Freeman, Carroll edit 9',
        'newValue': '1  $a Freeman, Carroll edit 10',
      }, {
        'changeType': 'MODIFIED',
        'fieldName': 'LDR',
        'fullPath': 'LDR',
        'oldValue': '00461nz  a2200145n  4500',
        'newValue': '00462nz  a2200145n  4500',
      }],
      'collectionChanges': [],
    },
  }, {
    'eventId': '09f5d973-39f4-4a9e-8de7-2a713c074445',
    'entityId': '4027355e-9095-5577-8b5d-c7bffe9d3597',
    'eventDate': '2026-04-01T15:51:51.135+00:00',
    'eventTs': 1775058711135,
    'origin': 'mod-source-record-storage-5.10.15',
    'action': 'UPDATED',
    'userId': 'user-id',
    'diff': {
      'fieldChanges': [{
        'changeType': 'MODIFIED',
        'fieldName': '100',
        'fullPath': '100',
        'oldValue': '1  $a Freeman, Carroll edit 8',
        'newValue': '1  $a Freeman, Carroll edit 9',
      }],
      'collectionChanges': [],
    },
  }],
  totalRecords,
};

const onCloseMock = jest.fn();
const marcId = 'marcId';

const mockGet = jest.fn();

const getComponent = (props = {}) => (
  <Harness>
    <MarcVersionHistory
      id={marcId}
      onClose={onCloseMock}
      marcType="bib"
      tenantId="tenant-id"
      {...props}
    />
  </Harness>
);

const renderMarcVersionHistory = (props) => render(getComponent(props));

describe('MarcVersionHistory', () => {
  const scrollIntoViewOriginal = Element.prototype.scrollIntoView;

  beforeEach(() => {
    jest.clearAllMocks();
    useStripes.mockReturnValue(buildStripes({
      hasPerm: mockHasPerm,
    }));
    useOkapiKy.mockReturnValue({
      get: mockGet,
    });
    mockGet.mockImplementation(() => ({
      json: jest.fn().mockResolvedValue(auditDataResponse),
    }));
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
    it('should display the next page with the correct total number of cards', async () => {
      renderMarcVersionHistory();

      mockGet.mockReturnValue({
        json: jest.fn().mockResolvedValue(auditDataResponseWithNextPage),
      });

      await waitFor(() => fireEvent.click(screen.getByRole('button', { name: 'stripes-components.mcl.loadMore' })));

      await waitFor(() => expect(screen.getAllByText('stripes-components.auditLog.card.changed')).toHaveLength(3));
    });
  });

  describe('when there is a user view permission', () => {
    it('should display username as a link', async () => {
      renderMarcVersionHistory();

      await waitFor(() => expect(screen.getByRole('link', { name: 'lastName, firstName' })).toBeInTheDocument());
    });
  });

  describe('when there is no a user view permission', () => {
    it('should display username as not a link', async () => {
      mockHasPerm.mockReturnValue(false);

      renderMarcVersionHistory();

      await waitFor(() => {
        expect(screen.queryByRole('link', { name: 'lastName, firstName' })).toBeNull();
        expect(screen.getByText('lastName, firstName')).toBeInTheDocument();
      });
    });
  });

  it('should render the total number of records in a header', async () => {
    renderMarcVersionHistory();

    await waitFor(() => expect(screen.getByText(totalRecords)).toBeInTheDocument());
  });

  describe('when loading more audit data', () => {
    beforeEach(async () => {
      renderMarcVersionHistory();

      mockGet.mockReturnValue({
        json: jest.fn().mockImplementation(() => new Promise()),
      });

      await waitFor(() => fireEvent.click(screen.getByRole('button', { name: 'stripes-components.mcl.loadMore' })));
    });

    it('should display previous totalRecords', () => {
      expect(screen.getByText(totalRecords)).toBeInTheDocument();
    });

    it('should display a loader inside LoadMore button', () => {
      expect(screen.getByText('stripes-components.auditLog.pane.loadingLabel')).toBeInTheDocument();
    });
  });

  it('should fetch users from central tenant', async () => {
    const centralTenantId = 'central-tenant-id';
    const usersId = ['user-id'];

    useStripes.mockReturnValue(buildStripes({
      hasPerm: mockHasPerm,
      user: {
        user: {
          consortium: {
            centralTenantId,
          },
        },
      },
    }));

    renderMarcVersionHistory();

    await waitFor(() => expect(useUsersBatch).toHaveBeenCalledWith(usersId, { tenantId: centralTenantId }));
  });
});

