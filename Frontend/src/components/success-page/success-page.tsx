import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../header/header';
import styles from './success-page.module.scss';
import CheckIcon from '../../assets/icons/check-icon.svg';

export const SuccessPage = () => {
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
      <div className={styles.successBox}>
        <img src={CheckIcon} alt="Success Icon" className={styles.successIcon} />
        <div className={styles.successTitle}>Úspech!</div>
        <div className={styles.successMessage}>Operácia prebehla úspešne.</div>
        <button className={styles.successButton} onClick={() => navigate('/')}>
          Späť na hlavnú stránku
        </button>
      </div>
    </div>
  );
};