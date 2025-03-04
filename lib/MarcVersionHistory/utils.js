import { Link } from 'react-router-dom';
import sortBy from 'lodash/sortBy';

import { formatDateTime } from '@folio/stripes-acq-components';

import {
  AUDIT_FIELD_ACTIONS,
  AUDIT_COLLECTION_ACTIONS,
} from './constants';

const prefixFieldName = (field, formatMessage) => formatMessage(
  { id: 'stripes-marc-components.versionHistory.fieldPrefix' },
  { field },
);

export const transformVersion = (version, formatMessage) => {
  const { diff: marcDiff, eventDate } = version;
  const diff = {
    fieldChanges: [],
  };

  // Process added fields
  if (marcDiff.added) {
    marcDiff.added.forEach(entry => {
      diff.fieldChanges.push({
        changeType: AUDIT_FIELD_ACTIONS.ADDED,
        fieldName: prefixFieldName(entry.field, formatMessage),
        newValue: entry.newValue,
      });
    });
  }

  // Process modified fields
  if (marcDiff.modified) {
    marcDiff.modified.forEach(entry => {
      diff.fieldChanges.push({
        changeType: AUDIT_FIELD_ACTIONS.MODIFIED,
        fieldName: prefixFieldName(entry.field, formatMessage),
        newValue: entry.newValue,
        oldValue: entry.oldValue,
      });
    });
  }

  // Process removed fields
  if (marcDiff.removed) {
    marcDiff.removed.forEach(entry => {
      diff.fieldChanges.push({
        changeType: AUDIT_FIELD_ACTIONS.REMOVED,
        fieldName: prefixFieldName(entry.field, formatMessage),
        oldValue: entry.oldValue,
      });
    });
  }

  return {
    ...version,
    diff,
    eventTs: new Date(eventDate).valueOf(), // convert event date string to timestamp. timestamp is used for fetching more records
  };
};

/**
 * Merge fieldChanges and collectionChanges into a list of changed fields and sort by changeType
 * @param {Object} diff
 * @param {Array} diff.fieldChanges
 * @param {Array} diff.collectionChanges
 * @returns {Array.<{fieldName: String, changeType: String, newValue: any, oldValue: any}>}
 */
export const getChangedFieldsList = diff => {
  const fieldChanges = diff.fieldChanges ?
    diff.fieldChanges.map(field => ({
      fieldName: field.fieldName,
      changeType: field.changeType,
      newValue: field.newValue,
      oldValue: field.oldValue,
    }))
    : [];

  const collectionChanges = diff.collectionChanges ?
    diff.collectionChanges.flatMap(collection => {
      return collection.itemChanges.map(field => ({
        fieldName: collection.collectionName,
        changeType: field.changeType,
        newValue: field.newValue,
        oldValue: field.oldValue,
      }));
    })
    : [];

  return sortBy([...fieldChanges, ...collectionChanges], data => data.changeType);
};

export const versionsFormatter = (usersMap, intl) => diffArray => {
  const anonymousUserLabel = intl.formatMessage({ id: 'ui-inventory.versionHistory.anonymousUser' });

  const getUserName = userId => {
    const user = usersMap[userId];

    return user ? `${user.personal.lastName}, ${user.personal.firstName}` : null;
  };

  const getSourceLink = userId => {
    return userId ? <Link to={`/users/preview/${userId}`}>{getUserName(userId)}</Link> : anonymousUserLabel;
  };

  return diffArray
    .filter(({ action }) => action !== AUDIT_COLLECTION_ACTIONS.CREATED)
    .map(({ eventDate, eventTs, userId, eventId, diff }) => ({
      eventDate: formatDateTime(eventDate, intl),
      source: getSourceLink(userId),
      userName: getUserName(userId) || anonymousUserLabel,
      fieldChanges: diff ? getChangedFieldsList(diff) : [],
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
