import { useMemo } from 'react';
import { useInfiniteQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

export const useMarcAuditDataQuery = (id, marcType, tenantId) => {
  const ky = useOkapiKy({ tenant: tenantId });
  const [namespace] = useNamespace({ key: 'marc-audit-data' });

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    ...rest
  } = useInfiniteQuery({
    queryKey: [namespace, id, marcType, tenantId],
    queryFn: ({ pageParam }) => ky.get(`audit-data/marc/${marcType}/${id}`, {
      searchParams: {
        ...(pageParam && { eventTs: pageParam }),
      },
    }).json(),
    getNextPageParam: (lastPage, allPages) => {
      const totalRecords = lastPage?.totalRecords || 0;
      const totalFetchedItems = allPages.reduce((sum, page) => {
        return sum + (page?.marcAuditItems?.length || 0);
      }, 0);

      // if we've fetched all records, return undefined to disable further loading
      if (totalFetchedItems >= totalRecords) {
        return undefined;
      }

      // otherwise, return the timestamp of the last item for the next page
      const items = lastPage?.marcAuditItems || [];

      return items.length > 0 ? items[items.length - 1].eventTs : undefined;
    },
    enabled: Boolean(id),
    cacheTime: 0,
  });

  // flatten all pages into a single array
  const flattenedData = useMemo(() => {
    return data?.pages?.flatMap(page => page?.marcAuditItems || []) || [];
  }, [data]);
  const totalRecords = data?.pages?.[0]?.totalRecords || 0;

  return {
    data: flattenedData,
    totalRecords,
    isLoading,
    isLoadingMore: isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    ...rest,
  };
};
