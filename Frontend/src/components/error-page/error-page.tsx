import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../header/header';
import styles from './error-page.module.scss';
import CrossIcon from '../../assets/icons/cross-icon.svg';

export const ErrorPage = ({ message }: { message?: string }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/');
    }, 5000);

    return () => clearTimeout(timer); 
  }, [navigate]);

  return (
    <div className={styles.pageContainer}>
      <Header />
      <div className={styles.errorBox}>
        <img src={CrossIcon} alt="Error Icon" className={styles.errorIcon} />
        <div className={styles.errorTitle}>Chyba!</div>
        <div className={styles.errorMessage}>
          {message || "Nastala chyba pri spracovaní požiadavky."}
        </div>
        <button className={styles.errorButton} onClick={() => navigate("/")}>
          Späť na hlavnú stránku
        </button>
      </div>
    </div>
  );
};