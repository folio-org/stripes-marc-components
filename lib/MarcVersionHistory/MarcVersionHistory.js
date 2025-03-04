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
  transformVersion,
  versionsFormatter,
  getActionLabel,
} from './utils';

const propTypes = {
  id: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

const MarcVersionHistory = ({ onClose, id }) => {
  const intl = useIntl();
  const [usersId, setUsersId] = useState([]);
  const [usersMap, setUsersMap] = useState({});
  const [lastVersionEventTs, setLastVersionEventTs] = useState(null);

  const { users } = useUsersBatch(usersId);

  // cleanup when component unmounts
  useEffect(() => () => {
    setUsersMap({});
  }, []);

  const {
    data,
    totalRecords,
    isLoading,
  } = useMarcAuditDataQuery(id, lastVersionEventTs);

  // update usersId when data changes
  useEffect(() => {
    if (!data?.length) return;

    const updatedUsersId = uniq(data.map(i => i.userId));

    setUsersId(updatedUsersId);
  }, [data]);

  // update usersMap when new users are fetched
  useEffect(() => {
    if (!users?.length) return;

    setUsersMap(prevState => ({
      ...prevState,
      ...keyBy(users, 'id'),
    }));
  }, [users]);

  const transformedVersions = useMemo(() => data?.map(version => transformVersion(version, intl.formatMessage)), [data]);
  const actionsMap = { ...getActionLabel(intl.formatMessage) };

  const {
    versions,
    isLoadedMoreVisible,
  } = useVersionHistory({
    data: transformedVersions,
    totalRecords,
    versionsFormatter: versionsFormatter(usersMap, intl),
  });

  const handleLoadMore = lastEventTs => {
    setLastVersionEventTs(lastEventTs);
  };

  return (
    <AuditLogPane
      versions={versions}
      isLoadedMoreVisible={isLoadedMoreVisible}
      handleLoadMore={handleLoadMore}
      actionsMap={actionsMap}
      onClose={onClose}
      isLoading={isLoading}
    />
  );
};

MarcVersionHistory.propTypes = propTypes;

export { MarcVersionHistory };
