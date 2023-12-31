import { Router as DefaultRouter } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import { StripesContext } from '@folio/stripes/core';

import IntlProvider from './intl';
import buildStripes from '../__mock__/stripesCore.mock';

const STRIPES = buildStripes();

const queryClient = new QueryClient();

const Harness = ({
  Router = DefaultRouter,
  stripes,
  children,
  history = createMemoryHistory(),
}) => {
  return (
    <QueryClientProvider client={queryClient}>
      <StripesContext.Provider value={stripes || STRIPES}>
        <Router history={history}>
          <IntlProvider>
            {children}
          </IntlProvider>
        </Router>
      </StripesContext.Provider>
    </QueryClientProvider>
  );
};

export default Harness;
