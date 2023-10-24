import { render, act } from '@folio/jest-config-stripes/testing-library/react';

import { runAxeTest } from '@folio/stripes-testing';

import MarcView from './MarcView';

import Harness from '../../test/jest/helpers/harness';

jest.mock('../queries', () => ({
  ...jest.requireActual('../queries'),
  useAuthorityLinkingRules: jest.fn().mockReturnValue({
    linkingRules: [{ bibField: '100' }, { bibField: '240' }],
  }),
}));

const marc = {
  parsedRecord: {
    id: 'a178daf3-b10a-4ff9-a4bf-703a0091f043',
    content: {
      fields: [{
        '001': 'in00000000140',
      }, {
        '008': '120126r20122010nyu      b    001 0 eng  ',
      }, {
        '005': '20211207090250.8',
      }, {
        '100': {
          'ind1': '/',
          'ind2': '/',
          subfields: [{
            a: 'Some controlled value',
          }, {
            9: 'authority-id',
          }],
        },
      }, {
        '245': {
          'ind1': '1',
          'ind2': '0',
          subfields: [{
            a: 'Across the line of control :',
          }, {
            b: 'inside Pakistan-administered Jammu and Kashmir /',
          }, {
            b: 'Luv Puri.',
          }],
          isHighlighted: true,
        },
      }, {
        '999': {
          ind1: 'f',
          ind2: 'f',
          subfields: [{
            s: '225f733f-8231-4d48-b104-a9c56d675eec',
          }, {
            i: '225f733f-8231-4d48-b104-a9c56d675eec',
          }],
        },
      }],
      leader: '00331cam a2200085 a 4500',
    },
  },
  recordType: 'MARC_BIB',
};

const mockOnClose = jest.fn();

const renderMarcView = (props = {}) => render(
  <Harness>
    <MarcView
      paneTitle="Pane title"
      paneSub="Pane sub"
      marcTitle="MARC title"
      marc={marc}
      onClose={mockOnClose}
      {...props}
    />
  </Harness>,
);

describe('Given MarcView', () => {
  it('should render with no axe errors', async () => {
    const { container } = renderMarcView();

    await act(() => runAxeTest({
      rootNode: container,
    }));
  });

  it('should show pane title', () => {
    const { getByText } = renderMarcView();

    expect(getByText('Pane title')).toBeDefined();
  });

  it('should show pane sub', () => {
    const { getByText } = renderMarcView();

    expect(getByText('Pane sub')).toBeDefined();
  });

  it('should show MARC title', () => {
    const { getByText } = renderMarcView();

    expect(getByText('MARC title')).toBeDefined();
  });

  it('should show MARC leader', () => {
    const { getByText } = renderMarcView();

    expect(getByText(`LEADER ${marc.parsedRecord.content.leader}`)).toBeDefined();
  });

  it('should render paneset wrapper', () => {
    const { getByTestId } = renderMarcView();

    expect(getByTestId('qm-view-paneset')).toBeDefined();
  });

  describe('when a field has isHighlighted flag', () => {
    it('should highlight the field content', () => {
      const { container } = renderMarcView();

      const highlightedContent = [...container.querySelectorAll('mark')].map(mark => mark.textContent).join(' ');

      expect(highlightedContent).toEqual('Across the line of control : inside Pakistan-administered Jammu and Kashmir / Luv Puri.');
    });
  });

  describe('when there is a linked field', () => {
    it('should display authority link', () => {
      const { getByTestId } = renderMarcView();

      expect(getByTestId('authority-app-link-authority-id')).toBeDefined();
    });
  });

  describe('when "isPaneset" prop is false', () => {
    it('should not render paneset wrapper', () => {
      const { queryByTestId } = renderMarcView({
        isPaneset: false,
      });

      expect(queryByTestId('qm-view-paneset')).toBeNull();
    });
  });

  describe('when present "lastMenu" prop', () => {
    it('should render "lastMenu" prop', () => {
      const { getByText } = renderMarcView({
        lastMenu: <div>Last Menu Node</div>,
      });

      expect(getByText('Last Menu Node')).toBeDefined();
    });
  });
});
