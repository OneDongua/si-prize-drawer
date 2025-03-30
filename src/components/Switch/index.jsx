import React from 'react';
import styles from './index.module.css';

const Switch = ({ checked, onChange }) => {
  return (
    <label className={styles.switch}>
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span className={styles.slider}></span>
    </label>
  );
};

export default Switch;