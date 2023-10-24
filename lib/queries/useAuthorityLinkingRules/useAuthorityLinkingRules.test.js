import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';
import { renderHook, waitFor } from '@folio/jest-config-stripes/testing-library/react';

import { useOkapiKy } from '@folio/stripes/core';

import useAuthorityLinkingRules from './useAuthorityLinkingRules';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(),
}));

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('Given useAuthorityLinkingRules', () => {
  const mockGet = jest.fn(() => ({
    json: () => Promise.resolve([]),
  }));

  beforeEach(() => {
    useOkapiKy.mockClear().mockReturnValue({
      get: mockGet,
    });
  });

  it('should fetch linking rules', () => {
    renderHook(() => useAuthorityLinkingRules(), { wrapper });
    waitFor(() => expect(mockGet).toHaveBeenCalled());
  });
});
