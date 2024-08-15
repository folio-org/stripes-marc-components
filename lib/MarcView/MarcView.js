import PropTypes from 'prop-types';
import noop from 'lodash/noop';

import {
  Pane,
  Paneset,
} from '@folio/stripes/components';

import { MarcContent } from './MarcContent';

const propTypes = {
  actionMenu: PropTypes.node,
  firstMenu: PropTypes.element,
  isPaneset: PropTypes.bool,
  lastMenu: PropTypes.node,
  marc: PropTypes.object.isRequired,
  marcTitle: PropTypes.node.isRequired,
  onClose: PropTypes.func,
  paneHeight: PropTypes.string,
  paneSub: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.string,
  ]),
  paneTitle: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.string,
  ]).isRequired,
  paneWidth: PropTypes.string,
  tenantId: PropTypes.string,
};

const MarcView = ({
  paneTitle,
  paneSub,
  paneHeight,
  marcTitle,
  marc,
  onClose,
  paneWidth,
  firstMenu,
  lastMenu,
  isPaneset,
  tenantId,
  actionMenu,
}) => {
  const renderContent = () => (
    <Pane
      paneTitle={paneTitle}
      paneSub={paneSub}
      defaultWidth={paneWidth}
      id="marc-view-pane"
      dismissible
      onClose={onClose}
      data-test-instance-marc
      data-testid="marc-view-pane"
      height={paneHeight}
      firstMenu={firstMenu}
      lastMenu={lastMenu}
      actionMenu={actionMenu}
    >
      <MarcContent
        marcTitle={marcTitle}
        marc={marc}
        tenantId={tenantId}
      />
    </Pane>
  );

  return isPaneset
    ? (
      <Paneset
        isRoot
        data-testid="qm-view-paneset"
      >
        {renderContent()}
      </Paneset>
    )
    : renderContent();
};

MarcView.propTypes = propTypes;
MarcView.defaultProps = {
  firstMenu: null,
  isPaneset: true,
  lastMenu: null,
  onClose: noop,
  paneHeight: null,
  paneSub: '',
  paneWidth: '',
  tenantId: null,
  actionMenu: null,
};

export { MarcView };
