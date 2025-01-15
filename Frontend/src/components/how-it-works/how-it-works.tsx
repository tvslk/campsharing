import styles from "./how-it-works.module.scss";
import { useNavigate } from "react-router-dom";
import { Header } from "../header/header";

export const HowItWorks = () => {
    const navigate = useNavigate();
    const handleRedirect = () => {
        navigate("/register");
    }

  return (
    <div className={styles.container}>
      <Header className={styles.header} />

      <section className={styles.heroSection}>
        <h1 className={styles.title}>Ako to funguje</h1>
        <p className={styles.subtitle}>
          CampSharing prepája komunitu milovníkov kempovania – zdieľajte miesta, vybavenie a vytvárajte nové zážitky.
        </p>
      </section>

      <section className={styles.featuresSection}>
        <h2 className={styles.featuresTitle}>Hlavné funkcie</h2>
        <div className={styles.featuresGrid}>
          <div className={styles.feature}>
            <h3 className={styles.featureTitle}>Zdieľanie vybavenia</h3>
            <p className={styles.featureDescription}>
              Prenajmite alebo si požičajte kempovacie vybavenie jednoducho a rýchlo.
            </p>
          </div>
          <div className={styles.feature}>
            <h3 className={styles.featureTitle}>Hľadanie miest</h3>
            <p className={styles.featureDescription}>
              Objavujte nové miesta pre kempovanie priamo od komunity.
            </p>
          </div>
          <div className={styles.feature}>
            <h3 className={styles.featureTitle}>Kalendár rezervácií</h3>
            <p className={styles.featureDescription}>
              Plánujte vaše prenájmy a kempingové výlety s jednoduchým kalendárom.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.getStartedSection}>
        <h2 className={styles.getStartedTitle}>Ako začať</h2>
        <ol className={styles.stepsList}>
          <li className={styles.step}>
            <h3 className={styles.stepTitle}>1. Zaregistrujte sa</h3>
            <p className={styles.stepDescription}>
              Vytvorte si účet, aby ste mohli využívať všetky funkcie platformy.
            </p>
          </li>
          <li className={styles.step}>
            <h3 className={styles.stepTitle}>2. Nahrajte vybavenie</h3>
            <p className={styles.stepDescription}>
              Zdieľajte svoje kempingové vybavenie s ostatnými užívateľmi.
            </p>
          </li>
          <li className={styles.step}>
            <h3 className={styles.stepTitle}>3. Nájdite a rezervujte</h3>
            <p className={styles.stepDescription}>
              Objavte perfektné miesto pre váš ďalší výlet a jednoducho si ho zarezervujte.
            </p>
          </li>
        </ol>
      </section>

      <section className={styles.ctaSection}>
        <h2 className={styles.ctaTitle}>Pridajte sa k našej komunite!</h2>
        <button className={styles.ctaButton} onClick={handleRedirect}>Začať teraz</button>
      </section>
    </div>
  );
};