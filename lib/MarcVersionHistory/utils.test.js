import {
  getChangedFieldsList,
  transformVersion,
} from './utils';

describe('transformVersion', () => {
  it('should return versions list in a format that AuditLogPane accepts', () => {
    const marcAuditVersion = {
      eventDate: '1970-01-01T00:00:00+00:00',
      action: 'UPDATED',
      diff: {
        modified: [
          {
            field: '999',
            newValue: 'ff $s new value',
            oldValue: 'ff $s old value',
          },
        ],
        added: [
          {
            field: '550',
            newValue: '$a new 550',
          },
        ],
        removed: [
          {
            field: '100',
            oldValue: '$a 100',
          },
        ],
      },
    };

    const expectedVersion = {
      action: 'UPDATED',
      eventDate: '1970-01-01T00:00:00+00:00',
      eventTs: 0,
      diff: {
        fieldChanges: [{
          changeType: 'ADDED',
          fieldName: '550',
          newValue: '$a new 550',
        }, {
          changeType: 'MODIFIED',
          fieldName: '999',
          oldValue: 'ff $s old value',
          newValue: 'ff $s new value',
        }, {
          changeType: 'REMOVED',
          fieldName: '100',
          oldValue: '$a 100',
        }],
      },
    };

    expect(transformVersion(marcAuditVersion)).toEqual(expect.objectContaining(expectedVersion));
  });
});

describe('getChangedFieldsList', () => {
  it('should return correct list of changed fields', () => {
    const diff = {
      fieldChanges: [{
        fieldName: 'fieldName',
        changeType: 'ADDED',
        newValue: 'newValue',
      }],
      collectionChanges: [{
        collectionName: 'contributors',
        itemChanges: [{
          changeType: 'EDITED',
          newValue: 'contr 1',
          oldValue: 'contr 2',
        }],
      }],
    };
    const result = [
      {
        fieldName: 'fieldName',
        changeType: 'ADDED',
        newValue: 'newValue',
      }, {
        fieldName: 'contributors',
        changeType: 'EDITED',
        newValue: 'contr 1',
        oldValue: 'contr 2',
      },
    ];

    expect(getChangedFieldsList(diff)).toEqual(result);
  });

  it('should return correct list of changed fields if fieldChanges is empty', () => {
    const diff = {
      collectionChanges: [{
        collectionName: 'contributors',
        itemChanges: [{
          changeType: 'EDITED',
          newValue: 'contr 1',
          oldValue: 'contr 2',
        }],
      }],
    };
    const result = [
      {
        fieldName: 'contributors',
        changeType: 'EDITED',
        newValue: 'contr 1',
        oldValue: 'contr 2',
      },
    ];

    expect(getChangedFieldsList(diff)).toEqual(result);
  });

  it('should return correct list of changed fields if collectionChanges is empty', () => {
    const diff = {
      fieldChanges: [{
        fieldName: 'fieldName',
        changeType: 'ADDED',
        newValue: 'newValue',
      }],
    };
    const result = [
      {
        fieldName: 'fieldName',
        changeType: 'ADDED',
        newValue: 'newValue',
      },
    ];

    expect(getChangedFieldsList(diff)).toEqual(result);
  });

  it('should sort changes by change type', () => {
    const diff = {
      fieldChanges: [{
        fieldName: 'fieldName',
        changeType: 'REMOVED',
        newValue: 'newValue',
      }, {
        fieldName: 'fieldName',
        changeType: 'EDITED',
        newValue: 'newValue',
      }, {
        fieldName: 'fieldName',
        changeType: 'ADDED',
        newValue: 'newValue',
      }],
    };
    const result = [
      {
        fieldName: 'fieldName',
        changeType: 'ADDED',
        newValue: 'newValue',
      }, {
        fieldName: 'fieldName',
        changeType: 'EDITED',
        newValue: 'newValue',
      }, {
        fieldName: 'fieldName',
        changeType: 'REMOVED',
        newValue: 'newValue',
      },
    ];

    expect(getChangedFieldsList(diff)).toEqual(result);
  });
});
