import PropTypes from 'prop-types';
import classNames from 'classnames';

import { Headline } from '@folio/stripes/components';

import { MarcField } from '../MarcField';

import styles from './MarcContent.css';

const propTypes = {
  isPrint: PropTypes.bool,
  marc: PropTypes.object.isRequired,
  marcTitle: PropTypes.node.isRequired,
  tenantId: PropTypes.string,
  wrapperClass: PropTypes.string,
};

const MarcContent = ({
  marcTitle,
  marc,
  isPrint = false,
  tenantId = null,
  wrapperClass = null,
}) => {
  const showLinkIcon = marc.recordType === 'MARC_BIB';
  const parsedContent = marc.parsedRecord.content;

  return (
    <section className={classNames([styles.marcWrapper, wrapperClass])}>
      <Headline
        size="large"
        margin="small"
        tag="h3"
      >
        {marcTitle}
      </Headline>
      <table className={styles.marc}>
        <tbody>
          <tr>
            <td colSpan="4">
              {`LEADER ${parsedContent.leader}`}
            </td>
          </tr>
          {parsedContent.fields.map((field, idx) => (
            <MarcField
              isPrint={isPrint}
              field={field}
              key={idx}
              showLinkIcon={showLinkIcon}
              tenantId={tenantId}
            />
          ))}
        </tbody>
      </table>
    </section>
  );
};

MarcContent.propTypes = propTypes;

export { MarcContent };
