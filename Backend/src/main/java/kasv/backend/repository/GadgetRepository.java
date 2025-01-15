package kasv.backend.repository;

import kasv.backend.model.Gadget;
import kasv.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GadgetRepository extends JpaRepository<Gadget, Long> {
    List<Gadget> findByUser(User user);
}