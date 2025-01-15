package kasv.backend.repository;

import kasv.backend.model.Review;
import kasv.backend.model.Gadget;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
}