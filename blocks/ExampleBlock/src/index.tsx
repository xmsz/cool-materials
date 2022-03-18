import React from 'react';
import PropTypes from 'prop-types';

import styles from './index.module.scss';

export default function ExampleBlock({ value }) {
  return (
    <div className={styles.ExampleBlock}>
      ExampleBlock {value}
    </div>
  );
}

ExampleBlock.propTypes = {
  value: PropTypes.string,
};

ExampleBlock.defaultProps = {
  value: 'string data',
};
