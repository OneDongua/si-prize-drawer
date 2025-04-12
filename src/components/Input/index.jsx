import React from "react";
import styles from "./index.module.css";

const Input = ({ label, type = "text", ...props }) => {
  return (
    <div className={styles.inputContainer}>
      <input
        className={styles.input}
        type={type}
        placeholder=""
        {...props}
      />
      <label className={styles.label}>{label}</label>
    </div>
  );
};

export default Input;