import styles from "./additional-services.module.scss";
import { Header } from "../header/header";
import serviceImage1 from "../../assets/img/service1.jpg";
import serviceImage2 from "../../assets/img/service2.jpg";
import serviceImage3 from "../../assets/img/service3.jpg";
import backImage from "../../assets/img/back4.png";

const additionalServices = [
  {
    title: "Zostavenie stanu v mieste kempovania",
    description: "Pomoc so stavaním stanu na ideálnom mieste pre vaše pohodlie.",
    image: serviceImage1,
  },
  {
    title: "Zabezpečenie základných kempovacích potrieb",
    description: "Zaobstarajte si podpaľovač, nôž a ďalšie potrebné vybavenie.",
    image: serviceImage2,
  },
  {
    title: "Založenie ohňa",
    description: "Profesionálne založenie ohňa pre pohodlné a bezpečné varenie.",
    image: serviceImage3,
  },
];

export const AdditionalServices = () => {
  return (
    <div
    className={styles.container}
    style={{ backgroundImage: `url(${backImage})` }}
>
    <div className={styles.container}>
      <Header />
      <div className={styles.header}>
        <h1>Doplnkové služby</h1>
        <p>Vyberte si z našich doplnkových služieb a vylepšite svoj kempingový zážitok.</p>
      </div>
      <div className={styles.servicesGrid}>
        {additionalServices.map((service, index) => (
          <div className={styles.serviceCard} key={index}>
            <div className={styles.imageContainer}>
              <img src={service.image} alt={service.title} />
            </div>
            <div className={styles.cardContent}>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
  );
};