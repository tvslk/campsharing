import { useNavigate } from 'react-router-dom';
import { Header } from '../header/header';
import styles from './error-page.module.scss';
import CrossIcon from '../../assets/icons/cross-icon.svg';

export const Error404 = ({ message }: { message?: string }) => {
  const navigate = useNavigate();

  return (
    <div className={styles.pageContainer}>
      <Header />
      <div className={styles.errorBox}>
        <img src={CrossIcon} alt="Error Icon" className={styles.errorIcon} />
        <div className={styles.errorTitle}>404</div>
        <div className={styles.errorMessage}>
          {message || "Stránka neexistuje."}
        </div>
        <button className={styles.errorButton} onClick={() => navigate("/")}>
          Späť na hlavnú stránku
        </button>
      </div>
    </div>
  );
};