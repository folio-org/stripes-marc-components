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
  paneProps: PropTypes.object,
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
  wrapperClass: PropTypes.string,
};

const MarcView = ({
  paneTitle,
  paneSub = '',
  paneHeight = null,
  marcTitle,
  marc,
  onClose = noop,
  paneWidth = '',
  firstMenu = null,
  lastMenu = null,
  isPaneset = true,
  tenantId = null,
  actionMenu = null,
  wrapperClass = null,
  paneProps = {},
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
      {...paneProps}
    >
      <MarcContent
        marcTitle={marcTitle}
        marc={marc}
        tenantId={tenantId}
        wrapperClass={wrapperClass}
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

export { MarcView };
