package kasv.backend.repository;

import kasv.backend.model.GadgetPhoto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GadgetPhotoRepository extends JpaRepository<GadgetPhoto, Long> {
    List<GadgetPhoto> findByGadgetId(Long gadgetId);

    GadgetPhoto findByGadgetIdAndImageUrl(Long gadgetId, String photoUrl);
}