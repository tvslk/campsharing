import { useState, useEffect } from "react";
import { Header } from "../header/header";
import styles from "./reviews.module.scss";

type Review = {
  id: number;
  review: string;
  rating: number;
};

export const Recenzie = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReview, setNewReview] = useState("");
  const [hoveredRating, setHoveredRating] = useState<number>(0); 
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(
          "https://campsharing-dbdjb9cycyhjcjdp.westeurope-01.azurewebsites.net/api/reviews/all"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch reviews.");
        }

        const data: Review[] = await response.json();
        setReviews(data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchReviews();
  }, []);

  
  const handleSubmit = async () => {
    if (newReview.trim() === "" || selectedRating === 0) {
      alert("Both review text and rating are required.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "https://campsharing-dbdjb9cycyhjcjdp.westeurope-01.azurewebsites.net/api/reviews/add",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ review: newReview, rating: selectedRating }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add review.");
      }

      const result = await response.json();
      setReviews((prev) => [...prev, result.review]); 
      setNewReview("");
      setSelectedRating(0);
      setHoveredRating(0); 
    } catch (error) {
      console.error("Error adding review:", error);
      alert("Failed to add review.");
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number, isEditable = false) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span
        key={index}
        className={`${styles.star} ${
          index < (isEditable ? hoveredRating || selectedRating : rating)
            ? styles.filledStar
            : styles.emptyStar
        }`}
        onMouseEnter={() => isEditable && setHoveredRating(index + 1)}
        onMouseLeave={() => isEditable && setHoveredRating(0)}
        onClick={() => isEditable && setSelectedRating(index + 1)}
      >
        ★
      </span>
    ));
  };

  return (
    <div className={styles.container}>
      <Header className={styles.header} />
      <h1 className={styles.title}>Recenzie a Skúsenosti</h1>

      <div className={styles.reviewsList}>
        {reviews.length === 0 ? (
          <p>Žiadne recenzie zatiaľ nie sú k dispozícii.</p>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className={styles.reviewCard}>
              <p>{review.review}</p>
              <div className={styles.rating}>{renderStars(review.rating)}</div>
            </div>
          ))
        )}
      </div>

      <div className={styles.reviewForm}>
        <textarea
          className={styles.textInput}
          placeholder="Napíšte svoju recenziu..."
          value={newReview}
          onChange={(e) => setNewReview(e.target.value)}
        />
        <div className={styles.ratingSelector}>
          {renderStars(0, true)}
        </div>
        <button
          className={styles.submitButton}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Odosielanie..." : "Odoslať"}
        </button>
      </div>
    </div>
  );
};