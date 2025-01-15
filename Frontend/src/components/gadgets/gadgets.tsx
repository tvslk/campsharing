import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../header/header";
import styles from "./gadgets.module.scss";
import arrowLeft from "../../assets/icons/arrow-left.svg";
import arrowRight from "../../assets/icons/arrow-right.svg";

type Gadget = {
  id: number;
  gadgetName: string;
  gadgetDescription: string;
  pricePerDay: number;
  width: number;
  height: number;
  length: number;
  weight: number;
  material: string;
  category: string; 
  userEmail: string;
  imageUrl?: string;
};

type ArrowVisibility = {
  [category: string]: {
    showLeft: boolean;
    showRight: boolean;
  };
};

export const Gadgets = () => {
  const [gadgets, setGadgets] = useState<Gadget[]>([]);
  const [arrowVisibility, setArrowVisibility] = useState<ArrowVisibility>({});
  const categoryRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGadgets = async () => {
      try {
        const response = await fetch(
          "https://campsharing-dbdjb9cycyhjcjdp.westeurope-01.azurewebsites.net/api/gadgets/all"
        );
        if (!response.ok) throw new Error("Failed to fetch gadgets.");
        const data: Gadget[] = await response.json();

        
        const gadgetsWithImages = await Promise.all(
          data.map(async (gadget) => {
            try {
              const imageResponse = await fetch(
                `https://campsharing-dbdjb9cycyhjcjdp.westeurope-01.azurewebsites.net/api/gadgets/${gadget.id}/photos`
              );
              if (imageResponse.ok) {
                const imageData = await imageResponse.json();
                gadget.imageUrl =
                  imageData.urls && imageData.urls.length > 0
                    ? imageData.urls[0]
                    : "https://via.placeholder.com/150";
              } else {
                gadget.imageUrl = "https://via.placeholder.com/150";
              }
            } catch {
              gadget.imageUrl = "https://via.placeholder.com/150";
            }
            return gadget;
          })
        );

        setGadgets(gadgetsWithImages);
      } catch (error) {
        console.error("Error fetching gadgets:", error);
      }
    };

    fetchGadgets();
  }, []);

  
  const categories = [...new Set(gadgets.map((g) => g.category))];

  const updateArrowVisibility = (category: string) => {
    const ref = categoryRefs.current[category];
    if (ref) {
      const { scrollLeft, scrollWidth, clientWidth } = ref;
      setArrowVisibility((prev) => ({
        ...prev,
        [category]: {
          showLeft: scrollLeft > 0,
          showRight: scrollLeft + clientWidth < scrollWidth,
        },
      }));
    }
  };

  const scrollCarousel = (category: string, direction: "left" | "right") => {
    const ref = categoryRefs.current[category];
    if (ref) {
      const scrollAmount = direction === "left" ? -300 : 300;
      ref.scrollBy({ left: scrollAmount, behavior: "smooth" });
      setTimeout(() => updateArrowVisibility(category), 300);
    }
  };

  const handleReserveClick = (gadget: Gadget) => {
    localStorage.setItem("selectedGadgetId", gadget.id.toString());
    navigate(`/gadget-reservation/${gadget.id}`);
  };

  useEffect(() => {
    categories.forEach((category) => {
      updateArrowVisibility(category);
    });
  }, [gadgets]);

  return (
    <div className={styles.container}>
      <Header className={styles.header} />

      <div className={styles.content}>
        {categories.map((category, index) => (
          <div key={category} className={styles.categorySection}>
            <h2 className={styles.categoryTitle}>{category}</h2>

            <div className={styles.carouselWrapper}>
              {arrowVisibility[category]?.showLeft && (
                <button
                  className={`${styles.arrow} ${styles.left}`}
                  onClick={() => scrollCarousel(category, "left")}
                >
                  <img src={arrowLeft} alt="Scroll left" />
                </button>
              )}

              <div
                id={`carousel-${category}`}
                ref={(el) => (categoryRefs.current[category] = el)}
                className={styles.gadgetCarousel}
                onScroll={() => updateArrowVisibility(category)}
              >
                {gadgets
                  .filter((g) => g.category === category)
                  .map((gadget) => (
                    <div key={gadget.id} className={styles.gadgetCard}>
                      <img
                        src={gadget.imageUrl || "https://via.placeholder.com/150"}
                        onError={(e) =>
                          (e.currentTarget.src = "https://via.placeholder.com/150")
                        }
                        alt={gadget.gadgetName}
                        className={styles.gadgetImage}
                      />
                      <h3 className={styles.gadgetName}>{gadget.gadgetName}</h3>
                      <p className={styles.gadgetDescription}>
                        {gadget.gadgetDescription}
                      </p>
                      <button
                        className={styles.addButton}
                        onClick={() => handleReserveClick(gadget)}
                      >
                        +
                      </button>
                    </div>
                  ))}
              </div>

              {arrowVisibility[category]?.showRight && (
                <button
                  className={`${styles.arrow} ${styles.right}`}
                  onClick={() => scrollCarousel(category, "right")}
                >
                  <img src={arrowRight} alt="Scroll right" />
                </button>
              )}
            </div>

            {index !== categories.length - 1 && <hr className={styles.divider} />}
          </div>
        ))}
      </div>
    </div>
  );
};