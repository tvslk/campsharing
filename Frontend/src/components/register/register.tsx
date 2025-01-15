import styles from "./register.module.scss";
import cx from "classnames";
import { RegisterForm } from "../register-form/register-form";
import { Header } from "../header/header";

export interface RegisterProps {
  errorMessage?: string; 
  className?: string; 
}

export const Register = ({ className, errorMessage }: RegisterProps) => {
  return (
    <div className={cx(styles.root, className)}>
      <Header className={styles.header} />
      <div className={cx(styles.registerContainer, className)}>
        <div className={styles.headerGroup}>
          <h2 className={styles["h1-text"]}>
            Prosím zadajte údaje pre registráciu
          </h2>
        </div>

       {errorMessage && (
          <div className={cx(styles.errorMessage, 'error-message')}>
            <p>{errorMessage}</p>
          </div>
        )}

        <RegisterForm />
      </div>
    </div>
  );
};