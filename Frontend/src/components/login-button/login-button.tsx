import React from "react";
import styles from "./login-button.module.scss";

export interface LoginButtonProps {
  children: React.ReactNode;
  type?: "button" | "submit" | "reset"; 
}

export const LoginButton = ({ children, type = "button" }: LoginButtonProps) => {
  return (
    <button className={styles.button} type={type}>
      {children}
    </button>
  );
};