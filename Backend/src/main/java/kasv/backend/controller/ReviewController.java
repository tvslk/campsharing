package kasv.backend.controller;

import kasv.backend.model.Review;
import kasv.backend.service.ReviewService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private static final Logger logger = LoggerFactory.getLogger(ReviewController.class);

    @Autowired
    private ReviewService reviewService;

    @GetMapping("/all")
    public ResponseEntity<List<Review>> getAllReviews() {
        try {
            List<Review> reviews = reviewService.getAllReviews();
            return ResponseEntity.ok(reviews);
        } catch (Exception e) {
            logger.error("Failed to retrieve reviews", e);
            return ResponseEntity.status(500).build();
        }
    }

    @PostMapping("/add")
    public ResponseEntity<Map<String, Object>> addReview(@RequestBody Review review) {
        try {
            logger.info("Adding new review");
            Review savedReview = reviewService.addReview(review);
            return ResponseEntity.status(201).body(Map.of("message", "Review added successfully", "review", savedReview));
        } catch (Exception e) {
            logger.error("Failed to add review", e);
            return ResponseEntity.status(400).body(Map.of("message", e.getMessage()));
        }
    }
}