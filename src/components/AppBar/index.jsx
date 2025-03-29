import React from 'react';
import styles from "./index.module.css";

const AppBar = ({ title }) => {
  return (
    <div className={styles.appBar}>
      <div className={styles.toolbar}>
        <div className={styles.title}>{title}</div>
        <div>
        </div>
      </div>
    </div>
  );
};

export default AppBar;