import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

const useAuthorityLinkingRules = ({ tenantId } = {}) => {
  const ky = useOkapiKy({ tenantId });
  const [namespace] = useNamespace({ key: 'authority-linking-rules' });

  const { isFetching, data } = useQuery(
    [namespace],
    async () => {
      return ky.get('linking-rules/instance-authority').json();
    },
  );

  return ({
    linkingRules: data || [],
    isLoading: isFetching,
  });
};

export default useAuthorityLinkingRules;
