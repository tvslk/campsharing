import { useRef, useState, useEffect } from "react";
import { Header } from "../header/header";
import styles from "./popular-camps.module.scss";
import arrowLeft from "../../assets/icons/arrow-left.svg";
import arrowRight from "../../assets/icons/arrow-right.svg";
import backImage from "../../assets/img/back4.png";
import meddol from "../../assets/img/meddol.jpg";
import hammer from "../../assets/img/hammer.jpg";
import kalvaria from "../../assets/img/kalvaria.jpg";
import jasov from "../../assets/img/jasov.jpg";
import sokol from "../../assets/img/sokol.jpg";



const mockCamps = [
  {
    id: 1,
    name: "Medená dolina",
    location: "Košice",
    description: "V srdci prírody, ideálne pre nadšencov turistiky.",
    img: meddol,
  },
  {
    id: 2,
    name: "Hammer Lake Camp",
    location: "Bratislava",
    description: "Pokojný kemp pri jazere, ideálny na rybolov a člnkovanie.",
    img: hammer,
  },
  {
    id: 3,
    name: "Kalvária Kemp",
    location: "Žilina",
    description: "Rodinné prostredie s výbornými službami a úžasným výhľadom.",
    img: kalvaria,
  },
  {
    id: 4,
    name: "Autokemping Jasov",
    location: "Prešov",
    description: "Útulný kemp v blízkosti historického Jasovského kláštora.",
    img: jasov,
  },
  {
    id: 5,
    name: "Apartmány Sokol",
    location: "Banská Bystrica",
    description: "Moderné apartmány obklopené lesmi a turistickými chodníkmi.",
    img: sokol,
  },
];

export const PopularCamps = () => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const updateArrowVisibility = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft + clientWidth < scrollWidth);
    }
  };

  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.addEventListener("scroll", updateArrowVisibility);
      carouselRef.current.addEventListener("touchstart", updateArrowVisibility); 
    }
    return () => {
      if (carouselRef.current) {
        carouselRef.current.removeEventListener("scroll", updateArrowVisibility);
        carouselRef.current.removeEventListener("touchstart", updateArrowVisibility); 
      }
    };
  }, []);

  return (
    <div
      className={styles.container}
      style={{ backgroundImage: `url(${backImage})` }}>
      <Header />
      <div className={styles.header}>
        <h1>Populárne miesta</h1>
        <p>Objavte tie najobľúbenejšie miesta na kempovanie po celom Slovensku.</p>
      </div>
      <div className={styles.carouselWrapper}>
        {showLeftArrow && (
          <button
            className={`${styles.arrow} ${styles.left}`}
            onClick={() => carouselRef.current?.scrollBy({ left: -300, behavior: "smooth" })}
          >
            <img src={arrowLeft} alt="Posun doľava" />
          </button>
        )}
        <div className={styles.carousel} ref={carouselRef}>
          {mockCamps.map((camp) => (
            <div key={camp.id} className={styles.carouselItem}>
              <div className={styles.imageContainer}>
                <img src={camp.img} alt={camp.name} />
              </div>
              <div className={styles.details}>
                <h3>{camp.name}</h3>
                <p>{camp.location}</p>
                <p>{camp.description}</p>
              </div>
            </div>
          ))}
        </div>
        {showRightArrow && (
          <button
            className={`${styles.arrow} ${styles.right}`}
            onClick={() => carouselRef.current?.scrollBy({ left: 300, behavior: "smooth" })}
          >
            <img src={arrowRight} alt="Posun doprava" />
          </button>
        )}
      </div>
    </div>
  );
};