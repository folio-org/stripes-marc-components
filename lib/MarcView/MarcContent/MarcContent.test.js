import { render } from '@folio/jest-config-stripes/testing-library/react';

import { runAxeTest } from '@folio/stripes-testing';

import Harness from '../../../test/jest/helpers/harness';

import { MarcContent } from './MarcContent';

jest.mock('../MarcField', () => ({
  MarcField: jest.fn(({ field }) => <tr><td>MarcField {JSON.stringify(field)}</td></tr>),
}));

const marc = {
  parsedRecord: {
    id: 'a178daf3-b10a-4ff9-a4bf-703a0091f043',
    content: {
      fields: [{
        '001': 'in00000000140',
      }, {
        '852': '$b E',
      }, {
        '008': '120126r20122010nyu      b    001 0 eng  ',
      }],
      leader: '00331cam a2200085 a 4500',
    },
  },
  recordType: 'MARC_BIB',
};

const renderMarcContent = (props = {}) => render(
  <Harness>
    <MarcContent
      marcTitle={<>fakeMarkTitle</>}
      marc={marc}
      {...props}
    />
  </Harness>,
);

describe('Given MarcContent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render with no axe errors', async () => {
    const { container } = renderMarcContent();

    await runAxeTest({
      rootNode: container,
    });
  });

  it('should show the marc title', () => {
    const { getByText } = renderMarcContent();

    expect(getByText('fakeMarkTitle')).toBeVisible();
  });

  it('should display the content of the marc record', () => {
    const { getByText } = renderMarcContent();

    expect(getByText('LEADER 00331cam a2200085 a 4500')).toBeVisible();
  });

  it('should render list of marc fields', () => {
    const { getAllByText } = renderMarcContent();

    expect(getAllByText(/MarcField/).length).toBe(3);
  });

  it('should display fields in order provided in props', () => {
    const { getAllByRole } = renderMarcContent();

    const rows = getAllByRole('row');

    expect(rows[1].textContent.includes('"001"')).toBeTruthy();
    expect(rows[2].textContent.includes('"852"')).toBeTruthy();
    expect(rows[3].textContent.includes('"008"')).toBeTruthy();
  });
});
