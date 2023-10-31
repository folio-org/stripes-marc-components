import PropTypes from 'prop-types';

import {
  Pane,
  Paneset,
} from '@folio/stripes/components';

import { MarcContent } from './MarcContent';

const propTypes = {
  isPaneset: PropTypes.bool,
  lastMenu: PropTypes.node,
  marc: PropTypes.object.isRequired,
  marcTitle: PropTypes.node.isRequired,
  onClose: PropTypes.func.isRequired,
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
  lastMenu,
  isPaneset,
  tenantId,
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
      lastMenu={lastMenu}
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
  isPaneset: true,
  lastMenu: null,
  paneHeight: null,
  paneSub: '',
  paneWidth: '',
  tenantId: '',
};

export { MarcView };
