import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

export const useMarcAuditDataQuery = (id, marcType, eventTs, tenantId) => {
  const ky = useOkapiKy({ tenant: tenantId });
  const [namespace] = useNamespace({ key: 'marc-audit-data' });

  // eventTs param is used to load more data
  const { isLoading, data = {} } = useQuery({
    queryKey: [namespace, id, marcType, eventTs, tenantId],
    queryFn: () => ky.get(`audit-data/marc/${marcType}/${id}`, {
      searchParams: {
        ...(eventTs && { eventTs }),
      },
    }).json(),
    enabled: Boolean(id),
    cacheTime: 0,
  });

  return {
    data: data?.marcAuditItems || [],
    totalRecords: data?.totalRecords,
    isLoading,
  };
};
