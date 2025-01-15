import styles from "./login.module.scss";
import cx from "classnames";
import { LoginForm } from "../login-form/login-form";
import { Header } from "../header/header";

export interface LoginProps {
  errorMessage?: string; 
  className?: string; 
}

export const Login = ({ className, errorMessage }: LoginProps) => {
  return (
    <div className={cx(styles.root, className)}>
        <Header className={styles.header} />
      <div className={cx(styles.loginContainer, className)}>
        <div className={styles.headerGroup}>
          <h2 className={styles["h1-text"]}>
            Prosím zadajte vaše prihlasovacie údaje
          </h2>
        </div>

       {errorMessage && (
          <div className={cx(styles.errorMessage, 'error-message')}>
            <p>{errorMessage}</p>
          </div>
        )}

        <LoginForm />
      </div>
    </div>
  );
};
