import styles from "./hero-section.module.scss";
import cx from "classnames";
import DotSvg0 from "../../assets/svg/dot.svg";
import { useNavigate } from "react-router-dom";

export interface HeroSectionProps {
  className?: string;
}
export const HeroSection = ({ className }: HeroSectionProps) => {
  const navigate = useNavigate();

  const handleRedirectToAddGadgets = () => {
    const isLoggedIn = !!localStorage.getItem("token"); 
    if (isLoggedIn) {
      navigate("/addgadgets"); 
    } else {
      navigate("/login?redirect=/addgadgets"); 
    }
  };

  const handleRedirectToFindPlace = () => {
    const isLoggedIn = !!localStorage.getItem("token"); 
    if (isLoggedIn) {
      navigate("/find-place"); 
    } else {
      navigate("/login?redirect=/find-place"); 
    }
  };
  
  return (
    <div className={cx(styles.banner, className, styles.root)}>
    <h1 className={styles["h1-banner"]}>
        ZDIEĽAJTE KEMPOVANIE, BUDUJTE ZÁŽITKY
    </h1>

    <h6 className={styles["h6-banner"]}>
        Spojte sa s komunitou, zdieľajte svoje kempovacie miesta a vybavenie,
        objavujte nové dobrodružstvá
    </h6>

      <div className={styles["button-group"]}>
        <button className={styles["primary-button"]} onClick={handleRedirectToFindPlace}>NÁJSŤ MIESTO</button>
        <img
          src={DotSvg0}
          alt="Dot SVG"
          className={cx(styles.dotSvg, styles.dot)}
        />
        <button className={styles["secondary-button"]} onClick={handleRedirectToAddGadgets}>ZAČAŤ ZDIEĽAŤ</button>
      </div>
    </div>
  );
};
