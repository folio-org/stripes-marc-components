import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  renderHook,
  act,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import { useMarcAuditDataQuery } from './useMarcAuditDataQuery';

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useMarcAuditDataQuery', () => {
  const mockAuditData = {
    totalRecords: 3,
    marcAuditItems: [
      { eventTs: '2024-03-20T10:00:00Z', id: '1' },
      { eventTs: '2024-03-20T09:00:00Z', id: '2' },
    ],
  };

  beforeEach(() => {
    useOkapiKy.mockClear().mockReturnValue({
      get: () => ({
        json: jest.fn().mockResolvedValue(mockAuditData),
      }),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch config', async () => {
    const { result } = renderHook(useMarcAuditDataQuery, { wrapper, initialProps: ['id'] });

    await act(() => !result.current.isLoading);

    expect(result.current.data).toEqual(mockAuditData.marcAuditItems);
  });

  it('should handle fetchNextPage correctly', async () => {
    const secondPageData = {
      totalRecords: 3,
      marcAuditItems: [
        { eventTs: '2024-03-20T08:00:00Z', id: '3' },
      ],
    };

    useOkapiKy
      .mockClear()
      .mockReturnValueOnce({
        get: () => ({
          json: () => Promise.resolve(mockAuditData),
        }),
      })
      .mockReturnValueOnce({
        get: () => ({
          json: () => Promise.resolve(secondPageData),
        }),
      });

    const { result } = renderHook(
      () => useMarcAuditDataQuery('id'),
      { wrapper },
    );

    await act(() => !result.current.isLoading);

    await act(async () => {
      await result.current.fetchNextPage();
    });

    await waitFor(() => {
      expect(result.current.data).toHaveLength(3);
      expect(result.current.isLoadingMore).toBe(false);
    });
  });

  it('should set hasNextPage to false when all records are fetched', async () => {
    const singlePageData = {
      totalRecords: 2,
      marcAuditItems: [
        { eventTs: '2024-03-20T10:00:00Z', id: '1' },
        { eventTs: '2024-03-20T09:00:00Z', id: '2' },
      ],
    };

    useOkapiKy
      .mockClear()
      .mockReturnValueOnce({
        get: () => ({
          json: () => Promise.resolve(singlePageData),
        }),
      });

    const { result } = renderHook(
      () => useMarcAuditDataQuery('id'),
      { wrapper },
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.hasNextPage).toBe(false);
    });
  });
});
