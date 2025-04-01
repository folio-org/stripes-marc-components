import {
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import uniq from 'lodash/uniq';
import keyBy from 'lodash/keyBy';

import { useStripes } from '@folio/stripes/core';
import {
  AuditLogPane,
  useVersionHistory,
} from '@folio/stripes/components';
import { useUsersBatch } from '@folio/stripes-acq-components';

import { useMarcAuditDataQuery } from '../queries';
import {
  versionsFormatter,
  getActionLabel,
} from './utils';
import { MODAL_COLUMN_WIDTHS } from './constants';

const propTypes = {
  id: PropTypes.string.isRequired,
  isSharedFromLocalRecord: PropTypes.bool,
  marcType: PropTypes.oneOf(['bib', 'authority']).isRequired,
  onClose: PropTypes.func.isRequired,
  tenantId: PropTypes.string.isRequired,
};

const MarcVersionHistory = ({
  marcType,
  id,
  onClose,
  tenantId,
  isSharedFromLocalRecord = false,
}) => {
  const stripes = useStripes();
  const intl = useIntl();
  const [usersMap, setUsersMap] = useState({});
  const [lastVersionEventTs, setLastVersionEventTs] = useState(null);
  const [totalVersions, setTotalVersions] = useState(0);

  const {
    data,
    totalRecords,
    isLoading,
  } = useMarcAuditDataQuery(id, marcType, lastVersionEventTs, tenantId);

  const usersId = useMemo(() => uniq(data?.map(version => version.userId)), [data]);
  const hasUsersViewPerm = stripes.hasPerm('ui-users.view');
  const centralTenantId = stripes.user.user.consortium?.centralTenantId;

  const { users } = useUsersBatch(usersId, { tenantId: centralTenantId });

  // update usersMap when new users are fetched
  useEffect(() => {
    if (!users?.length) return;

    setUsersMap(prevState => ({
      ...prevState,
      ...keyBy(users, 'id'),
    }));
  }, [users]);

  const actionsMap = { ...getActionLabel(intl.formatMessage) };

  const {
    versions,
    isLoadMoreVisible,
  } = useVersionHistory({
    data,
    totalRecords: totalVersions,
    versionsFormatter: versionsFormatter(usersMap, intl, hasUsersViewPerm),
  });

  useEffect(() => {
    // totalRecords always returns undefined while loading, and we need to display the total number of versions.
    if (totalRecords) {
      setTotalVersions(totalRecords);
    }
  }, [totalRecords]);

  const handleLoadMore = lastEventTs => {
    setLastVersionEventTs(lastEventTs);
  };

  return (
    <AuditLogPane
      versions={versions}
      isLoadMoreVisible={isLoadMoreVisible}
      handleLoadMore={handleLoadMore}
      actionsMap={actionsMap}
      onClose={onClose}
      totalVersions={totalVersions}
      isLoading={isLoading}
      showSharedLabel={isSharedFromLocalRecord}
      columnWidths={MODAL_COLUMN_WIDTHS}
    />
  );
};

MarcVersionHistory.propTypes = propTypes;

export { MarcVersionHistory };
