package kasv.backend.repository;

import kasv.backend.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByGadgetId(Long gadgetId);
    List<Transaction> findByUserId(Long userId);
}