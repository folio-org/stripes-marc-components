import {
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import uniq from 'lodash/uniq';
import keyBy from 'lodash/keyBy';

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

const propTypes = {
  id: PropTypes.string.isRequired,
  marcType: PropTypes.oneOf(['bib', 'authority']).isRequired,
  onClose: PropTypes.func.isRequired,
};

const MarcVersionHistory = ({
  marcType,
  id,
  onClose,
}) => {
  const intl = useIntl();
  const [usersMap, setUsersMap] = useState({});
  const [lastVersionEventTs, setLastVersionEventTs] = useState(null);
  const {
    data,
    totalRecords,
    isLoading,
  } = useMarcAuditDataQuery(id, marcType, lastVersionEventTs);

  const usersId = useMemo(() => uniq(data?.map(version => version.userId)), [data]);

  const { users } = useUsersBatch(usersId);

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
    totalRecords,
    versionsFormatter: versionsFormatter(usersMap, intl),
  });

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
      isLoading={isLoading}
    />
  );
};

MarcVersionHistory.propTypes = propTypes;

export { MarcVersionHistory };
