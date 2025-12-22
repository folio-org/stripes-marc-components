import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
  useStripes,
} from '@folio/stripes/core';

const useAuthorityLinkingRules = ({ tenantId } = {}) => {
  const stripes = useStripes();
  const ky = useOkapiKy({ tenant: tenantId });
  const [namespace] = useNamespace({ key: 'authority-linking-rules' });

  const { isFetching, data } = useQuery(
    [namespace],
    async () => {
      return ky.get('linking-rules/instance-authority').json();
    },
    {
      enabled: stripes.hasInterface('instance-authority-linking-rules'),
    },
  );

  return ({
    linkingRules: data || [],
    isLoading: isFetching,
  });
};

export { useAuthorityLinkingRules };
