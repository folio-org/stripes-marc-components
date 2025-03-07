import { Link } from 'react-router-dom';
import sortBy from 'lodash/sortBy';

import { formatDateTime } from '@folio/stripes-acq-components';

import {
  AUDIT_COLLECTION_ACTIONS,
  AUDIT_FIELD_ACTIONS,
} from './constants';

const prefixFieldName = (field, formatMessage) => formatMessage(
  { id: 'stripes-marc-components.versionHistory.fieldPrefix' },
  { field },
);

/**
 * Merge fieldChanges and collectionChanges into a list of changed fields and sort by changeType
 * @param {Object} diff
 * @param {Function} formatMessage
 * @param {Array} diff.fieldChanges
 * @param {Array} diff.collectionChanges
 * @returns {Array.<{fieldName: String, changeType: String, newValue: any, oldValue: any}>}
 */
export const getChangedFieldsList = (diff, formatMessage) => {
  const fieldChanges = diff.fieldChanges ?
    diff.fieldChanges.map(field => ({
      fieldName: prefixFieldName(field.fieldName, formatMessage),
      changeType: field.changeType,
      newValue: field.newValue,
      oldValue: field.oldValue,
    }))
    : [];

  const collectionChanges = diff.collectionChanges ?
    diff.collectionChanges.flatMap(collection => {
      return collection.itemChanges.map(field => ({
        fieldName: prefixFieldName(collection.collectionName, formatMessage),
        changeType: field.changeType,
        newValue: field.newValue,
        oldValue: field.oldValue,
      }));
    })
    : [];

  return sortBy([...fieldChanges, ...collectionChanges], data => data.changeType);
};

export const versionsFormatter = (usersMap, intl, hasUsersViewPerm) => diffArray => {
  const anonymousUserLabel = intl.formatMessage({ id: 'stripes-marc-components.versionHistory.anonymousUser' });

  const getUserName = userId => {
    const user = usersMap[userId];

    return user ? `${user.personal.lastName}, ${user.personal.firstName}` : null;
  };

  const getSourceLink = userId => {
    if (!userId) {
      return anonymousUserLabel;
    }

    const username = getUserName(userId);

    if (!hasUsersViewPerm) {
      return username;
    }

    return <Link to={`/users/preview/${userId}`}>{username}</Link>;
  };

  return diffArray
    .map(({ action, eventDate, eventTs, userId, eventId, diff }) => ({
      isOriginal: action === AUDIT_COLLECTION_ACTIONS.CREATED,
      eventDate: formatDateTime(eventDate, intl),
      source: getSourceLink(userId),
      userName: getUserName(userId) || anonymousUserLabel,
      fieldChanges: diff ? getChangedFieldsList(diff, intl.formatMessage) : [],
      eventId,
      eventTs,
    }));
};

/**
 * Gets translated change type label
 * @param {function} formatMessage
 * @returns {{ADDED, MODIFIED, REMOVED}}
 */
export const getActionLabel = formatMessage => {
  return {
    [AUDIT_FIELD_ACTIONS.ADDED]: formatMessage({ id: 'stripes-marc-components.versionHistory.action.added' }),
    [AUDIT_FIELD_ACTIONS.MODIFIED]: formatMessage({ id: 'stripes-marc-components.versionHistory.action.edited' }),
    [AUDIT_FIELD_ACTIONS.REMOVED]: formatMessage({ id: 'stripes-marc-components.versionHistory.action.removed' }),
  };
};
